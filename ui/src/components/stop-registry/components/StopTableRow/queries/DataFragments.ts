import { gql } from '@apollo/client';

const GQL_STOP_TABLE_ROW_SCHEDULED_STOP_POINT_DETAILS = gql`
  fragment StopTableRow_ScheduledStopPoint_Details on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    timing_place {
      timing_place_id
      label
    }
  }
`;

const GQL_STOP_TABLE_ROW_QUAY_DETAILS = gql`
  fragment StopTableRow_Quay_Details on stops_database_quay_newest_version {
    id
    netex_id
    public_code
    validity_start
    validity_end
    priority
    centroid
    description_value

    stop_place {
      id
      name_value

      stop_place_alternative_names {
        alternative_name {
          name_lang
          name_type
          name_value
        }
      }
    }

    stop_place_newest_version {
      id

      TiamatStopPlace {
        ... on stop_registry_StopPlace {
          id
          version

          quays {
            id
            version

            accessibilityAssessment {
              id
              version

              hslAccessibilityProperties {
                id
                version

                accessibilityLevel
              }
            }
            placeEquipments {
              id
              shelterEquipment {
                id
                version

                shelterType
                shelterElectricity
              }
              generalSign {
                id
                version

                replacesRailSign
                content {
                  lang
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GQL_STOP_REGISTRY_STOP_AREA_STOP_DETAILS = gql`
  fragment StopTableRow_StopArea_Details on stop_registry_StopPlace {
    id
    publicCode

    name {
      lang
      value
    }
    alternativeNames {
      nameType
      name {
        lang
        value
      }
    }

    quays {
      ...StopTableRow_StopArea_Quay_Details
    }
  }

  fragment StopTableRow_StopArea_Quay_Details on stop_registry_Quay {
    id
    version

    publicCode
    keyValues {
      key
      values
    }
    geometry {
      type
      coordinates
    }
    description {
      lang
      value
    }

    placeEquipments {
      id

      generalSign {
        id
        version

        replacesRailSign
        content {
          lang
          value
        }
      }
      shelterEquipment {
        id
        version

        shelterType
        shelterElectricity
      }
    }
    accessibilityAssessment {
      id
      version

      hslAccessibilityProperties {
        id
        version

        accessibilityLevel
      }
    }

    scheduled_stop_point {
      ...StopTableRow_ScheduledStopPoint_Details
    }
  }
`;
