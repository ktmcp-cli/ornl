import Conf from 'conf';

const config = new Conf({
  projectName: 'ktmcp-ornl',
  schema: {
    baseUrl: {
      type: 'string',
      default: 'https://daymet.ornl.gov/single-pixel'
    }
  }
});

export function getConfig(key) {
  return config.get(key);
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function getAllConfig() {
  return config.store;
}

export function clearConfig() {
  config.clear();
}

export default config;
