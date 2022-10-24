import { VehicleSubmodeOnInfraLinkInsertInput } from '../builders';
import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkExternalSourceEnum,
  InfrastructureNetworkInfrastructureLinkInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
} from '../generated/graphql';

// Note: These infra links don't actually exist, so they won't work in map matching.
export const infrastructureLinks: InfrastructureNetworkInfrastructureLinkInsertInput[] =
  [
    {
      infrastructure_link_id: 'ced51f16-71ad-49c0-8785-0903240e5a78',
      direction: InfrastructureNetworkDirectionEnum.Bidirectional,
      shape: {
        type: 'LineString',
        coordinates: [
          [12.1, 11.2, 0],
          [12.3, 10.1, 0],
        ],
      },
      estimated_length_in_metres: 1200,
      external_link_source: InfrastructureNetworkExternalSourceEnum.DigiroadR,
      external_link_id: '1',
    },
    {
      infrastructure_link_id: '96f5419d-5641-46e8-b61e-660db08a87c4',
      direction: InfrastructureNetworkDirectionEnum.Bidirectional,
      shape: {
        type: 'LineString',
        coordinates: [
          [12.3, 10.1, 0],
          [15.3, 14.1, 0],
        ],
      },
      estimated_length_in_metres: 1100,
      external_link_source: InfrastructureNetworkExternalSourceEnum.DigiroadR,
      external_link_id: '2',
    },
    {
      infrastructure_link_id: 'd654ff08-a7c3-4799-820c-6d61147dd1ad',
      direction: InfrastructureNetworkDirectionEnum.Bidirectional,
      shape: {
        type: 'LineString',
        coordinates: [
          [15.3, 14.1, 0],
          [9.3, 2.1, 0],
        ],
      },
      estimated_length_in_metres: 1600,
      external_link_source: InfrastructureNetworkExternalSourceEnum.DigiroadR,
      external_link_id: '3',
    },
    {
      infrastructure_link_id: '3986bcc4-f3d7-44b8-b46a-0ade9d014af6',
      direction: InfrastructureNetworkDirectionEnum.Bidirectional,
      shape: {
        type: 'LineString',
        coordinates: [
          [24.925251259734353, 60.16287920585574, 15],
          [24.92832655782573, 60.16391811339392, 15],
        ],
      },
      estimated_length_in_metres: 10,
      external_link_source: InfrastructureNetworkExternalSourceEnum.DigiroadR,
      external_link_id: '1',
    },
  ];

export const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: infrastructureLinks[0].infrastructure_link_id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: infrastructureLinks[1].infrastructure_link_id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: infrastructureLinks[2].infrastructure_link_id,
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];
