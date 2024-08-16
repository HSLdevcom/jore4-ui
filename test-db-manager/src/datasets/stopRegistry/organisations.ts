import {
  StopRegistryOrganisationInput,
  StopRegistryOrganisationType,
} from '../../generated/graphql';

export const seedOrganisationsByLabel = {
  jcd: {
    name: 'JCD',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501234567',
      email: 'jcd@example.com',
    },
  },
  clearChannel: {
    name: 'Clear Channel',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501223334',
      email: 'clear-channel@example.com',
    },
  },
  ely: {
    name: 'ELY-keskus',
    organisationType: StopRegistryOrganisationType.Other,
    privateContactDetails: {
      phone: '+358501234567',
      email: 'ely-keskus@example.com',
    },
  },
};

export const seedOrganisations: Array<StopRegistryOrganisationInput> =
  Object.values(seedOrganisationsByLabel);
