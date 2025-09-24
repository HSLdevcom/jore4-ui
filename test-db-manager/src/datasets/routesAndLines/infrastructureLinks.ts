import { VehicleSubmodeOnInfraLinkInsertInput } from '../../builders';
import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkExternalSourceEnum,
  InfrastructureNetworkInfrastructureLinkInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
} from '../../generated/graphql';
import { expectValue } from '../../utils';

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
      external_link_source:
        InfrastructureNetworkExternalSourceEnum.DigiroadRMml,
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
      external_link_source:
        InfrastructureNetworkExternalSourceEnum.DigiroadRMml,
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
      external_link_source:
        InfrastructureNetworkExternalSourceEnum.DigiroadRMml,
      external_link_id: '3',
    },
  ];

export const vehicleSubmodeOnInfrastructureLink: VehicleSubmodeOnInfraLinkInsertInput[] =
  [
    {
      infrastructure_link_id: expectValue(
        infrastructureLinks[0].infrastructure_link_id,
      ),
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: expectValue(
        infrastructureLinks[1].infrastructure_link_id,
      ),
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
    {
      infrastructure_link_id: expectValue(
        infrastructureLinks[2].infrastructure_link_id,
      ),
      vehicle_submode: ReusableComponentsVehicleSubmodeEnum.GenericBus,
    },
  ];
