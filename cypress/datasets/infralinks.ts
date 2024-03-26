// TODO: These two infralink sets could probably be combined,
// but currently a straightforward 'use the testInfraLinksFour
// on all tests' is not working, so going to do this iteratively

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.
export const testInfraLinksThree = [
  {
    externalId: '445156',
    coordinates: [24.925682785, 60.163824160000004, 7.3515],
  },
  {
    externalId: '442424',
    coordinates: [24.929275791498405, 60.1651950480433, 0],
  },
  {
    externalId: '442325',
    coordinates: [24.93312261043133, 60.16645636069328, 13.390046659939703],
  },
];

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.
export const testInfraLinksFour = [
  {
    externalId: '445156',
    coordinates: [24.925682785, 60.163824160000004, 7.3515],
  },
  {
    externalId: '442331',
    coordinates: [24.927565858, 60.1644843305, 9.778500000000001],
  },
  {
    externalId: '442424',
    coordinates: [24.929825718, 60.165285984, 9.957],
  },
  {
    externalId: '442325',
    coordinates: [24.93312261043133, 60.16645636069328, 13.390046659939703],
  },
];
