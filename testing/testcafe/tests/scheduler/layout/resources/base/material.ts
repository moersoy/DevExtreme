import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import { safeSizeTest } from '../../../../../helpers/safeSizeTest';
import Scheduler from '../../../../../model/scheduler';
import url from '../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture`Scheduler: Material theme layout`
  .page(url(__dirname, '../../../../container.html'));

safeSizeTest('Scheduler should have correct height in month view (T927862)', async (t) => {
  const scheduler = new Scheduler('#container');

  const boundingClientRect = await scheduler.dateTable.boundingClientRect;

  await t
    .expect(boundingClientRect.bottom)
    .eql((await scheduler.workspaceScrollable.boundingClientRect).bottom);
}).before(async () => {
  await changeTheme('material.blue.light');

  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    height: 800,
  }, true);
});

const createScheduler = async (view: string, resourcesValue?: unknown[]): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    views: [view],
    currentView: view,
    resources: resourcesValue,
    height: 600,
  }, true);
};

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    safeSizeTest(`Base views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => {
      await changeTheme('material.blue.light');

      return createScheduler(view, resourcesValue);
    });
  });
});

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    safeSizeTest(`Timeline views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => {
      await changeTheme('material.blue.light');

      return createScheduler(view, resourcesValue);
    });
  });
});
