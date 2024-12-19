import { getLocalData } from './util';
import { constantText } from './constants.text';

const checkModule = (parentModule, moduleName, permission, permissionKey) => {
  let { UserRole } = getLocalData('userData') || {};
  let ifPermission = false;
  UserRole?.map(perMissionObj => {
    if (perMissionObj.ParentModule == parentModule) {
      ifPermission= true;
    }
  });
  return ifPermission;
}

const checkPermission = (parentModule, moduleName, permission, permissionKey) => {
  let { UserRole } = getLocalData('userData') || {};
  let ifPermission = false;
  UserRole?.map(perMissionObj => {
    if (perMissionObj.ParentModule == parentModule) {
      perMissionObj?.ModulePermission?.map(moduleObj => {
        if (moduleObj.Module == moduleName) {
          let { SubModule } = moduleObj || {};
          ifPermission = (!!SubModule[permission] && !!SubModule[permission][permissionKey]);
        }
      });
    }
  });
  return ifPermission;
}

let { user_management, role_management,
  properties, video, seoSection, publish, cloneContent, cast_crew, licensingModule,
  content_management, movie, mapContent, content_translation,
  ancillary, cast, collections, masters, profile, images, assignAsset, addMasters, viewMasters, editMasters,
  related_content, collection_assignment, tv_shows, seasons, episodes,
  collectionAssignment, contentTranslations, relatedContent, schedule, review } = constantText.permission_static_text_obj;

export const permissionObj = {
  user: {
    canView: () => checkPermission(user_management, user_management, "ViewUser", "CreateEdit"),
    canCreate: () => checkPermission(user_management, user_management, "CreateUser", "CreateEdit"),
    canUpdate: () => checkPermission(user_management, user_management, "EditUser", "CreateEdit")
  },

  role: {
    canView: () => checkPermission(role_management, role_management, "ViewRole", "CreateEdit"),
    canCreate: () => checkPermission(role_management, role_management, "CreateRole", "CreateEdit"),
    canUpdate: () => checkPermission(role_management, role_management, "ManageRole", "CreateEdit")
  },

  movies: {
    canView: () => checkModule(content_management),
    canCreate: () => checkModule(content_management),
    canUpdate: () => checkModule(content_management),

    createMovie: {
      canView: () => true,
      canCreate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(content_management, movie, properties, "View"),
      canCreate: () => checkPermission(content_management, movie, properties, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, properties, "CreateEdit"),
    },
    castNCrewModule: {
      canView: () => checkPermission(content_management, movie, cast_crew, "View"),
      canCreate: () => checkPermission(content_management, movie, cast_crew, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, cast_crew, "CreateEdit"),
    },
    videosModule: {
      canView: () => checkPermission(content_management, movie, video, "View"),
      canCreate: () => checkPermission(content_management, movie, video, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, video, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(content_management, movie, licensingModule, "View"),
      canCreate: () => checkPermission(content_management, movie, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(content_management, movie, images, "View"),
      canCreate: () => checkPermission(content_management, movie, images, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(content_management, movie, seoSection, "View"),
      canCreate: () => checkPermission(content_management, movie, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, seoSection, "CreateEdit"),
    },
    mapContentModule: {
      canView: () => checkPermission(content_management, movie, mapContent, "View"),
      canCreate: () => checkPermission(content_management, movie, mapContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, mapContent, "CreateEdit"),
    },
    quickFiling:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
    },
    singleLanding:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, movie, properties, "CreateEdit") ||
        checkPermission(content_management, movie, cast_crew, "CreateEdit") ||
        checkPermission(content_management, movie, video, "CreateEdit") ||
        checkPermission(content_management, movie, licensingModule, "CreateEdit") ||
        checkPermission(content_management, movie, images, "CreateEdit") ||
        checkPermission(content_management, movie, seoSection, "CreateEdit") ||
        checkPermission(content_management, movie, mapContent, "CreateEdit")),
    },
    bulkPublish: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    clone: {
      canView: () => checkPermission(content_management, movie, cloneContent, "View"),
      canCreate: () => checkPermission(content_management, movie, cloneContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, cloneContent, "CreateEdit"),
    },
    archive: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    publish: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    schedule: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    review: {
      canView: () => checkPermission(content_management, movie, review, "View"),
      canCreate: () => checkPermission(content_management, movie, review, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, review, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    reject: {
      canView: () => checkPermission(content_management, movie, publish, "View"),
      canCreate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, publish, "CreateEdit"),
    },
    collectionAssignment:{
      canView: () => checkPermission(content_management, movie, collectionAssignment, "View"),
      canCreate: () => checkPermission(content_management, movie, collectionAssignment, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, collectionAssignment, "CreateEdit"),
    },
    translation:{
      canView: () => checkPermission(content_management, movie, contentTranslations, "View"),
      canCreate: () => checkPermission(content_management, movie, contentTranslations, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, contentTranslations, "CreateEdit"),
    },
    relatedContent:{
      canView: () => checkPermission(content_management, movie, relatedContent, "View"),
      canCreate: () => checkPermission(content_management, movie, relatedContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, movie, relatedContent, "CreateEdit"),
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  tvShows: {
    canView: () => checkModule(content_management, tv_shows),
    canCreate: () => checkModule(content_management, tv_shows),
    canUpdate: () => checkModule(content_management, tv_shows),

    createShow: {
      canView: () => true,
      canCreate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(content_management, tv_shows, properties, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, properties, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, properties, "CreateEdit"),
    },
    castNCrewModule: {
      canView: () => checkPermission(content_management, tv_shows, cast_crew, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, cast_crew, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, cast_crew, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(content_management, tv_shows, licensingModule, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(content_management, tv_shows, images, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, images, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(content_management, tv_shows, seoSection, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, seoSection, "CreateEdit"),
    },
    mapContentModule: {
      canView: () => checkPermission(content_management, tv_shows, mapContent, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, mapContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, mapContent, "CreateEdit"),
    },
    quickFiling:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
    },
    singleLanding:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, tv_shows, properties, "CreateEdit") ||
        checkPermission(content_management, tv_shows, cast_crew, "CreateEdit") ||
        checkPermission(content_management, tv_shows, licensingModule, "CreateEdit") ||
        checkPermission(content_management, tv_shows, images, "CreateEdit") ||
        checkPermission(content_management, tv_shows, seoSection, "CreateEdit") ||
        checkPermission(content_management, tv_shows, mapContent, "CreateEdit")),
    },
    publish: {
      canView: () => checkPermission(content_management, tv_shows, publish, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(content_management, tv_shows, publish, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
    },
    reject: {
      canView: () => checkPermission(content_management, tv_shows, publish, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
    },
    bulkPublish: {
      canView: () => checkPermission(content_management, tv_shows, publish, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
    },
    archive: {
      canView: () => checkPermission(content_management, tv_shows, publish, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, publish, "CreateEdit"),
    },
    clone: {
      canView: () => checkPermission(content_management, tv_shows, cloneContent, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, cloneContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, cloneContent, "CreateEdit"),
    },
    translation:{
      canView: () => checkPermission(content_management, tv_shows, contentTranslations, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, contentTranslations, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, contentTranslations, "CreateEdit"),
    },
    collectionAssignment: {
      canView: () => checkPermission(content_management, tv_shows, collection_assignment, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, collection_assignment, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, collection_assignment, "CreateEdit")
    },
    relatedContent: {
      canView: () => checkPermission(content_management, tv_shows, related_content, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, related_content, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, related_content, "CreateEdit")
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  season: {
    canView: () => checkModule(content_management, seasons),
    canCreate: () => checkModule(content_management, seasons),
    canUpdate: () => checkModule(content_management, seasons),

    createShow: {
      canView: () => true,
      canCreate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(content_management, seasons, properties, "View"),
      canCreate: () => checkPermission(content_management, seasons, properties, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, properties, "CreateEdit"),
    },
    castNCrewModule: {
      canView: () => checkPermission(content_management, seasons, cast_crew, "View"),
      canCreate: () => checkPermission(content_management, seasons, cast_crew, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, cast_crew, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(content_management, seasons, licensingModule, "View"),
      canCreate: () => checkPermission(content_management, seasons, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(content_management, seasons, images, "View"),
      canCreate: () => checkPermission(content_management, seasons, images, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(content_management, seasons, seoSection, "View"),
      canCreate: () => checkPermission(content_management, seasons, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, seoSection, "CreateEdit"),
    },
    mapContentModule: {
      canView: () => checkPermission(content_management, seasons, mapContent, "View"),
      canCreate: () => checkPermission(content_management, seasons, mapContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, mapContent, "CreateEdit"),
    },
    quickFiling:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
    },
    singleLanding:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, seasons, properties, "CreateEdit") ||
        checkPermission(content_management, seasons, cast_crew, "CreateEdit") ||
        checkPermission(content_management, seasons, licensingModule, "CreateEdit") ||
        checkPermission(content_management, seasons, images, "CreateEdit") ||
        checkPermission(content_management, seasons, seoSection, "CreateEdit") ||
        checkPermission(content_management, seasons, mapContent, "CreateEdit")),
    },
    publish: {
      canView: () => checkPermission(content_management, seasons, publish, "View"),
      canCreate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(content_management, seasons, publish, "View"),
      canCreate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
    },
    reject: {
      canView: () => checkPermission(content_management, seasons, publish, "View"),
      canCreate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
    },
    bulkPublish: {
      canView: () => checkPermission(content_management, seasons, publish, "View"),
      canCreate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
    },
    archive: {
      canView: () => checkPermission(content_management, seasons, publish, "View"),
      canCreate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, publish, "CreateEdit"),
    },
    clone: {
      canView: () => checkPermission(content_management, seasons, cloneContent, "View"),
      canCreate: () => checkPermission(content_management, seasons, cloneContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, cloneContent, "CreateEdit"),
    },
    translation:{
      canView: () => checkPermission(content_management, seasons, contentTranslations, "View"),
      canCreate: () => checkPermission(content_management, seasons, contentTranslations, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, contentTranslations, "CreateEdit"),
    },
    collectionAssignment: {
      canView: () => checkPermission(content_management, seasons, collection_assignment, "View"),
      canCreate: () => checkPermission(content_management, seasons, collection_assignment, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, collection_assignment, "CreateEdit")
    },
    relatedContent: {
      canView: () => checkPermission(content_management, seasons, related_content, "View"),
      canCreate: () => checkPermission(content_management, seasons, related_content, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, seasons, related_content, "CreateEdit")
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  episode: {
    canView: () => checkModule(content_management, episodes),
    canCreate: () => checkModule(content_management, episodes),
    canUpdate: () => checkModule(content_management, episodes),

    createShow: {
      canView: () => true,
      canCreate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(content_management, episodes, properties, "View"),
      canCreate: () => checkPermission(content_management, episodes, properties, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, properties, "CreateEdit"),
    },
    castNCrewModule: {
      canView: () => checkPermission(content_management, episodes, cast_crew, "View"),
      canCreate: () => checkPermission(content_management, episodes, cast_crew, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, cast_crew, "CreateEdit"),
    },
    videosModule: {
      canView: () => checkPermission(content_management, tv_shows, video, "View"),
      canCreate: () => checkPermission(content_management, tv_shows, video, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, tv_shows, video, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(content_management, episodes, licensingModule, "View"),
      canCreate: () => checkPermission(content_management, episodes, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(content_management, episodes, images, "View"),
      canCreate: () => checkPermission(content_management, episodes, images, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(content_management, episodes, seoSection, "View"),
      canCreate: () => checkPermission(content_management, episodes, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, seoSection, "CreateEdit"),
    },
    mapContentModule: {
      canView: () => checkPermission(content_management, episodes, mapContent, "View"),
      canCreate: () => checkPermission(content_management, episodes, mapContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, mapContent, "CreateEdit"),
    },
    quickFiling:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
    },
    singleLanding:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, episodes, properties, "CreateEdit") ||
        checkPermission(content_management, episodes, cast_crew, "CreateEdit") ||
        checkPermission(content_management, episodes, licensingModule, "CreateEdit") ||
        checkPermission(content_management, episodes, images, "CreateEdit") ||
        checkPermission(content_management, episodes, seoSection, "CreateEdit") ||
        checkPermission(content_management, episodes, mapContent, "CreateEdit")),
    },
    publish: {
      canView: () => checkPermission(content_management, episodes, publish, "View"),
      canCreate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(content_management, episodes, publish, "View"),
      canCreate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
    },
    reject: {
      canView: () => checkPermission(content_management, episodes, publish, "View"),
      canCreate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
    },
    bulkPublish: {
      canView: () => checkPermission(content_management, episodes, publish, "View"),
      canCreate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
    },
    archive: {
      canView: () => checkPermission(content_management, episodes, publish, "View"),
      canCreate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, publish, "CreateEdit"),
    },
    clone: {
      canView: () => checkPermission(content_management, episodes, cloneContent, "View"),
      canCreate: () => checkPermission(content_management, episodes, cloneContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, cloneContent, "CreateEdit"),
    },
    translation:{
      canView: () => checkPermission(content_management, episodes, contentTranslations, "View"),
      canCreate: () => checkPermission(content_management, episodes, contentTranslations, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, contentTranslations, "CreateEdit"),
    },
    collectionAssignment: {
      canView: () => checkPermission(content_management, episodes, collection_assignment, "View"),
      canCreate: () => checkPermission(content_management, episodes, collection_assignment, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, collection_assignment, "CreateEdit")
    },
    relatedContent: {
      canView: () => checkPermission(content_management, episodes, related_content, "View"),
      canCreate: () => checkPermission(content_management, episodes, related_content, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, episodes, related_content, "CreateEdit")
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  videos: {
    canView: () => checkModule(content_management),
    canCreate: () => checkModule(content_management),
    canUpdate: () => checkModule(content_management),

    createVideos: {
      canView: () => true,
      canCreate: () => (checkPermission(content_management, video, properties, "CreateEdit") ||
        checkPermission(content_management, video, cast_crew, "CreateEdit") ||
        checkPermission(content_management, video, video, "CreateEdit") ||
        checkPermission(content_management, video, licensingModule, "CreateEdit") ||
        checkPermission(content_management, video, images, "CreateEdit") ||
        checkPermission(content_management, video, seoSection, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, video, properties, "CreateEdit") ||
        checkPermission(content_management, video, cast_crew, "CreateEdit") ||
        checkPermission(content_management, video, video, "CreateEdit") ||
        checkPermission(content_management, video, licensingModule, "CreateEdit") ||
        checkPermission(content_management, video, images, "CreateEdit") ||
        checkPermission(content_management, video, seoSection, "CreateEdit")),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(content_management, video, properties, "View"),
      canCreate: () => checkPermission(content_management, video, properties, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, properties, "CreateEdit"),
    },
    castNCrewModule: {
      canView: () => checkPermission(content_management, video, cast_crew, "View"),
      canCreate: () => checkPermission(content_management, video, cast_crew, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, cast_crew, "CreateEdit"),
    },
    videosModule: {
      canView: () => checkPermission(content_management, video, video, "View"),
      canCreate: () => checkPermission(content_management, video, video, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, video, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(content_management, video, licensingModule, "View"),
      canCreate: () => checkPermission(content_management, video, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(content_management, video, images, "View"),
      canCreate: () => checkPermission(content_management, video, images, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(content_management, video, seoSection, "View"),
      canCreate: () => checkPermission(content_management, video, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, seoSection, "CreateEdit"),
    },
    quickFiling:{
      canView: () => true,
      canCreate: () => (checkPermission(content_management, video, properties, "CreateEdit") ||
        checkPermission(content_management, video, cast_crew, "CreateEdit") ||
        checkPermission(content_management, video, video, "CreateEdit") ||
        checkPermission(content_management, video, licensingModule, "CreateEdit") ||
        checkPermission(content_management, video, images, "CreateEdit") ||
        checkPermission(content_management, video, seoSection, "CreateEdit")),
      canUpdate: () => (checkPermission(content_management, video, properties, "CreateEdit") ||
        checkPermission(content_management, video, cast_crew, "CreateEdit") ||
        checkPermission(content_management, video, video, "CreateEdit") ||
        checkPermission(content_management, video, licensingModule, "CreateEdit") ||
        checkPermission(content_management, video, images, "CreateEdit") ||
        checkPermission(content_management, video, seoSection, "CreateEdit")),
    },
    bulkPublish: {
      canView: () => checkPermission(content_management, video, publish, "View"),
      canCreate: () => checkPermission(content_management, video, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, publish, "CreateEdit"),
    },
    clone: {
      canView: () => checkPermission(content_management, video, cloneContent, "View"),
      canCreate: () => checkPermission(content_management, video, cloneContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, cloneContent, "CreateEdit"),
    },
    archive: {
      canView: () => checkPermission(content_management, video, publish, "View"),
      canCreate: () => checkPermission(content_management, video, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, publish, "CreateEdit"),
    },
    publish: {
      canView: () => checkPermission(content_management, video, publish, "View"),
      canCreate: () => checkPermission(content_management, video, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(content_management, video, publish, "View"),
      canCreate: () => checkPermission(content_management, video, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, publish, "CreateEdit"),
    },
    reject: {
      canView: () => checkPermission(content_management, video, publish, "View"),
      canCreate: () => checkPermission(content_management, video, publish, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, publish, "CreateEdit"),
    },
    collectionAssignment:{
      canView: () => checkPermission(content_management, video, collectionAssignment, "View"),
      canCreate: () => checkPermission(content_management, video, collectionAssignment, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, collectionAssignment, "CreateEdit"),
    },
    translation:{
      canView: () => checkPermission(content_management, video, contentTranslations, "View"),
      canCreate: () => checkPermission(content_management, video, contentTranslations, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, contentTranslations, "CreateEdit"),
    },
    relatedContent:{
      canView: () => checkPermission(content_management, video, relatedContent, "View"),
      canCreate: () => checkPermission(content_management, video, relatedContent, "CreateEdit"),
      canUpdate: () => checkPermission(content_management, video, relatedContent, "CreateEdit"),
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  cast: {
    canView: () => checkModule(ancillary),
    canCreate: () => checkModule(ancillary),
    canUpdate: () => checkModule(ancillary),

    createCast:{
      canView: () => true,
      canCreate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
    },
    profile:{
      canView: () => checkPermission(ancillary, cast, profile, "View"),
      canCreate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
    },
    images:{
      canView: () => checkPermission(ancillary, cast, profile, "View"),
      canCreate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
    },
    faq:{
      canView: () => checkPermission(ancillary, cast, profile, "View"),
      canUpdate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
      addCreate: () => checkPermission(ancillary, cast, profile, "CreateEdit"),
    },
    archive:{
      canView: () => checkPermission(ancillary, cast, publish, "View"),
      canCreate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
    },
    publish: {
      canView: () => checkPermission(ancillary, cast, publish, "View"),
      canCreate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(ancillary, cast, publish, "View"),
      canCreate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, publish, "CreateEdit"),
    },
    translation: {
      canView: () => checkPermission(ancillary, cast, content_translation, "View"),
      canCreate: () => checkPermission(ancillary, cast, content_translation, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, cast, content_translation, "CreateEdit")
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  collections: {
    canView: () => checkModule(ancillary),
    canCreate: () => checkModule(ancillary),
    canUpdate: () => checkModule(ancillary),

    createCollection: {
      canView: () => true,
      canCreate: () => (checkPermission(ancillary, collections, properties, "CreateEdit") ||
        checkPermission(ancillary, collections, licensingModule, "CreateEdit") ||
        checkPermission(ancillary, collections, images, "CreateEdit") ||
        checkPermission(ancillary, collections, seoSection, "CreateEdit") ||
        checkPermission(ancillary, collections, assignAsset, "CreateEdit")),
      canUpdate: () => checkPermission(ancillary, collections, properties, "CreateEdit"),
    },
    contentPropertiesModule: {
      canView: () => checkPermission(ancillary, collections, properties, "View"),
      canCreate: () => checkPermission(ancillary, collections, properties, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, properties, "CreateEdit"),
    },
    licenceModule: {
      canView: () => checkPermission(ancillary, collections, licensingModule, "View"),
      canCreate: () => checkPermission(ancillary, collections, licensingModule, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, licensingModule, "CreateEdit"),
    },
    imagesModule: {
      canView: () => checkPermission(ancillary, collections, images, "View"),
      canCreate: () => checkPermission(ancillary, collections, images, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, images, "CreateEdit"),
    },
    seoModule: {
      canView: () => checkPermission(ancillary, collections, seoSection, "View"),
      canCreate: () => checkPermission(ancillary, collections, seoSection, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, seoSection, "CreateEdit"),
    },
    assignAsset: {
      canView: () => checkPermission(ancillary, collections, assignAsset, "View"),
      canCreate: () => checkPermission(ancillary, collections, assignAsset, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, assignAsset, "CreateEdit")
    },
    publish: {
      canView: () => checkPermission(ancillary, collections, publish, "View"),
      canCreate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
    },
    unPublish: {
      canView: () => checkPermission(ancillary, collections, publish, "View"),
      canCreate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
    },
    archive:{
      canView: () => checkPermission(ancillary, collections, publish, "View"),
      canCreate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, publish, "CreateEdit")
    },
    reject: {
      canView: () => checkPermission(ancillary, collections, publish, "View"),
      canCreate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, publish, "CreateEdit"),
    },
    translation: {
      canView: () => checkPermission(ancillary, collections, content_translation, "View"),
      canCreate: () => checkPermission(ancillary, collections, content_translation, "CreateEdit"),
      canUpdate: () => checkPermission(ancillary, collections, content_translation, "CreateEdit")
    },
    publishHistory: {
      canView: () => true,
      canCreate: () => true,
      canUpdate: () => true
    }
  },

  masters: {
    canView: () => checkPermission(ancillary, masters, viewMasters, "CreateEdit"),
    canCreate: () => checkPermission(ancillary, masters, addMasters, "CreateEdit"),
    canUpdate: () => checkPermission(ancillary, masters, editMasters, "CreateEdit")
  },

  always: {
    canView: () => true,
    canCreate: () => true,
    canUpdate: () => true
  },
}
