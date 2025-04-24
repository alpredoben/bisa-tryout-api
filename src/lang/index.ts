import MessageDialog from 'i18n';
import path from 'path';
import { Environments as cfg } from '../environments';

MessageDialog.configure({
  locales: ['id', 'en'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: cfg.AppLang,
  objectNotation: true,
  autoReload: true,
  updateFiles: false,
  syncFiles: true,
  register: global,
});

export { MessageDialog };
