/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { appendElementTo, insertStylesheetRule, deleteStylesheetRule } from '../../navigation/helpers/domUtils';
import Guid from '../../../../../js/core/guid';
import { getThemePostfix } from '../../../helpers/getPostfix';

const BUTTON_CLASS = 'dx-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const ICON_CLASS = 'dx-icon';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

fixture`Button`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];

themes.forEach((theme) => {
  test(`Buttons render (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`Button render${getThemePostfix(theme)}.png`, '#container'))
      .ok();

    await insertStylesheetRule(`.${BUTTON_CLASS} { width: 70px }`, 0);

    await t
      .expect(await takeScreenshot(`Button render with overflow${getThemePostfix(theme)}.png`, '#container'))
      .ok();

    await deleteStylesheetRule(0);

    await insertStylesheetRule(`.${BUTTON_TEXT_CLASS}, .${BUTTON_CLASS} .${ICON_CLASS} { font-size: 26px }`, 0);

    await t
      .expect(await takeScreenshot(`Button stretch of large text${getThemePostfix(theme)}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());

    await deleteStylesheetRule(0);
  }).before(async () => {
    await changeTheme(theme);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        for (const text of ['Button Text', '']) {
          for (const icon of ['home', undefined]) {
            for (const rtlEnabled of [true, false]) {
              const id = `${new Guid()}`;

              await appendElementTo('#container', 'div', id, { });
              await createWidget('dxButton', {
                stylingMode,
                text,
                type,
                rtlEnabled,
                icon,
              }, false, `#${id}`);
            }
          }
        }
      }
    }
  });
});
