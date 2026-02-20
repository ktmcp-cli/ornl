import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig } from './config.js';
import { getWeatherData, previewData } from './api.js';

const program = new Command();

// ============================================================
// Helpers
// ============================================================

function printSuccess(message) {
  console.log(chalk.green('✓') + ' ' + message);
}

function printError(message) {
  console.error(chalk.red('✗') + ' ' + message);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

async function withSpinner(message, fn) {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

function printTable(data, columns) {
  if (!data || data.length === 0) {
    console.log(chalk.yellow('No results found.'));
    return;
  }

  const widths = {};
  columns.forEach(col => {
    widths[col.key] = col.label.length;
    data.forEach(row => {
      const val = String(col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''));
      if (val.length > widths[col.key]) widths[col.key] = val.length;
    });
    widths[col.key] = Math.min(widths[col.key], 40);
  });

  const header = columns.map(col => col.label.padEnd(widths[col.key])).join('  ');
  console.log(chalk.bold(chalk.cyan(header)));
  console.log(chalk.dim('─'.repeat(header.length)));

  data.forEach(row => {
    const line = columns.map(col => {
      const val = String(col.format ? col.format(row[col.key], row) : (row[col.key] ?? ''));
      return val.substring(0, widths[col.key]).padEnd(widths[col.key]);
    }).join('  ');
    console.log(line);
  });

  console.log(chalk.dim(`\n${data.length} record(s)`));
}

// ============================================================
// Program metadata
// ============================================================

program
  .name('ornl')
  .description(chalk.bold('Daymet Weather CLI') + ' - Daily surface weather data from your terminal')
  .version('1.0.0');

// ============================================================
// CONFIG
// ============================================================

const configCmd = program.command('config').description('Manage CLI configuration');

configCmd
  .command('set')
  .description('Set configuration values')
  .option('--base-url <url>', 'API base URL')
  .action((options) => {
    if (options.baseUrl) {
      setConfig('baseUrl', options.baseUrl);
      printSuccess('Base URL set');
    } else {
      printError('No options provided. Use --base-url');
    }
  });

configCmd
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const baseUrl = getConfig('baseUrl');
    console.log(chalk.bold('\nDaymet Weather CLI Configuration\n'));
    console.log('Base URL: ', chalk.green(baseUrl || 'https://daymet.ornl.gov/single-pixel'));
    console.log('');
  });

// ============================================================
// GET
// ============================================================

program
  .command('get <lat> <lon>')
  .description('Get weather data for a location (latitude, longitude)')
  .option('--vars <list>', 'Comma-separated weather variables (e.g., tmin,tmax,prcp)')
  .option('--years <list>', 'Comma-separated years (1980-2019)')
  .option('--start <date>', 'Start date (YYYY-MM-DD)')
  .option('--end <date>', 'End date (YYYY-MM-DD)')
  .option('--format <type>', 'Output format: json or csv', 'json')
  .option('--json', 'Output as JSON')
  .action(async (lat, lon, options) => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        printError('Invalid coordinates');
        process.exit(1);
      }

      const params = {
        format: options.format
      };

      if (options.vars) {
        params.vars = options.vars.split(',').map(v => v.trim());
      }

      if (options.years) {
        params.years = options.years.split(',').map(y => y.trim());
      }

      if (options.start) {
        params.start = options.start;
      }

      if (options.end) {
        params.end = options.end;
      }

      const data = await withSpinner(
        `Fetching weather data for (${latitude}, ${longitude})...`,
        () => getWeatherData(latitude, longitude, params)
      );

      if (options.json || options.format === 'json') {
        printJson(data);
        return;
      }

      // If CSV format requested
      if (options.format === 'csv') {
        console.log(data);
        return;
      }

      // Display JSON data nicely
      console.log(chalk.bold(`\nWeather Data — (${chalk.cyan(latitude)}, ${chalk.cyan(longitude)})\n`));

      if (Array.isArray(data)) {
        const sample = data.slice(0, 20);
        printTable(sample, [
          { key: 'year', label: 'Year' },
          { key: 'yday', label: 'Day' },
          { key: 'prcp', label: 'Precip (mm)', format: v => v ? Number(v).toFixed(1) : 'N/A' },
          { key: 'tmax', label: 'Tmax (°C)', format: v => v ? Number(v).toFixed(1) : 'N/A' },
          { key: 'tmin', label: 'Tmin (°C)', format: v => v ? Number(v).toFixed(1) : 'N/A' }
        ]);

        if (data.length > 20) {
          console.log(chalk.dim(`\nShowing first 20 of ${data.length} records. Use --json to see all.`));
        }
      } else {
        printJson(data);
      }
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// PREVIEW
// ============================================================

program
  .command('preview <lat> <lon>')
  .description('Preview weather data in browser format')
  .option('--vars <list>', 'Comma-separated weather variables')
  .option('--years <list>', 'Comma-separated years')
  .option('--json', 'Output as JSON')
  .action(async (lat, lon, options) => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        printError('Invalid coordinates');
        process.exit(1);
      }

      const params = {};

      if (options.vars) {
        params.vars = options.vars.split(',').map(v => v.trim());
      }

      if (options.years) {
        params.years = options.years.split(',').map(y => y.trim());
      }

      const data = await withSpinner(
        `Fetching preview for (${latitude}, ${longitude})...`,
        () => previewData(latitude, longitude, params)
      );

      if (options.json) {
        printJson(data);
        return;
      }

      console.log(data);
    } catch (error) {
      printError(error.message);
      process.exit(1);
    }
  });

// ============================================================
// VARIABLES
// ============================================================

program
  .command('vars')
  .description('List available weather variables')
  .action(() => {
    console.log(chalk.bold('\nAvailable Weather Variables\n'));

    const variables = [
      { code: 'tmin', name: 'Minimum Temperature', unit: '°C' },
      { code: 'tmax', name: 'Maximum Temperature', unit: '°C' },
      { code: 'prcp', name: 'Precipitation', unit: 'mm/day' },
      { code: 'srad', name: 'Shortwave Radiation', unit: 'W/m²' },
      { code: 'vp', name: 'Vapor Pressure', unit: 'Pa' },
      { code: 'swe', name: 'Snow Water Equivalent', unit: 'kg/m²' },
      { code: 'dayl', name: 'Day Length', unit: 'seconds' }
    ];

    variables.forEach(v => {
      console.log(`${chalk.cyan(v.code.padEnd(6))} - ${v.name.padEnd(25)} (${chalk.dim(v.unit)})`);
    });

    console.log(chalk.dim('\nUse: ornl get <lat> <lon> --vars tmin,tmax,prcp'));
    console.log('');
  });

// ============================================================
// Parse
// ============================================================

program.parse(process.argv);

if (process.argv.length <= 2) {
  program.help();
}
