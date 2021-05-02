import CommentContract from '../DataContracts/CommentContract';
import TagUsageForApiContract from '../DataContracts/Tag/TagUsageForApiContract';
import UserBaseContract from '../DataContracts/User/UserBaseContract';
import UserEventRelationshipType from '../Models/Users/UserEventRelationshipType';
import ReleaseEventRepository from '../Repositories/ReleaseEventRepository';
import UserRepository from '../Repositories/UserRepository';
import UrlMapper from '../Shared/UrlMapper';
import ReleaseEventDetailsViewModel from '../ViewModels/ReleaseEvent/ReleaseEventDetailsViewModel';
import { IEntryReportType } from '../ViewModels/ReportEntryViewModel';

const EventDetails = (
  canDeleteAllComments: boolean,
  eventAssociationType: UserEventRelationshipType,
  model: {
    id: number;
    latestComments: CommentContract[];
    tags: TagUsageForApiContract[];
    usersAttending: UserBaseContract[];
  },
  reportTypes: IEntryReportType[],
) => {
  $(function () {
    $('#editEventLink').button({
      disabled: $('#editEventLink').hasClass('disabled'),
      icons: { primary: 'ui-icon-wrench' },
    });
    $('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
    $('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
    $('#manageTags').button({ icons: { primary: 'ui-icon-wrench' } });

    var loggedUserId = vdb.values.loggedUserId;
    var rootPath = vdb.values.baseAddress;
    var urlMapper = new UrlMapper(rootPath);
    var eventRepo = new ReleaseEventRepository(urlMapper);
    var userRepo = new UserRepository(urlMapper, loggedUserId);
    var latestComments = model.latestComments;
    var users = model.usersAttending;
    var tags = model.tags;

    var vm = new ReleaseEventDetailsViewModel(
      urlMapper,
      eventRepo,
      userRepo,
      latestComments,
      reportTypes,
      loggedUserId,
      model.id,
      eventAssociationType,
      users,
      tags,
      canDeleteAllComments,
    );
    ko.applyBindings(vm);

    $('.artistLink').vdbArtistToolTip();
  });
};

export default EventDetails;
