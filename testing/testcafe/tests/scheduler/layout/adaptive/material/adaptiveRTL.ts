import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../../../helpers/safeSizeTest';
import Scheduler from '../../../../../model/scheduler';
import { ADAPTIVE_SIZE } from '../../../const';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../../utils';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture`Scheduler: Adaptive Material theme layout in RTL`
  .page(url(__dirname, '../../../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    rtlEnabled: true,
    ...additionalProps,
  }, true);
};

[false, true].forEach((crossScrollingEnabled) => {
  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} in RTL`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-rtl.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views,
      currentView: 'day',
      crossScrollingEnabled,
    });
  });

  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping and RTL are used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal-rtl.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views: horizontalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  });

  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping and RTL are used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of verticalViews) {
      await scheduler.option('currentView', view.type);

      // Another bug in RTL in month view
      if (crossScrollingEnabled || view.type !== 'month') {
        await t.expect(
          await takeScreenshot(`material-view=${view.type}-crossScrolling=${crossScrollingEnabled}-vertical-rtl.png`, scheduler.workSpace),
        ).ok();
      }
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views: verticalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  });
});
