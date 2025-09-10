import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../redux';
import { MapMatchingNoSegmentError, showDangerToast } from '../../../../utils';
import { useLoader } from '../../../common/hooks';
import { useExtractRouteFromFeature } from './useExtractRouteFromFeature';

export const useFetchInfraLinksWithStops = () => {
  const { setIsLoading } = useLoader(Operation.FetchInfraLinksWithStops);
  const { t } = useTranslation();
  const { getInfraLinksWithStopsForGeometry } = useExtractRouteFromFeature();

  return useCallback(
    async (geometry: GeoJSON.LineString) => {
      setIsLoading(true);
      try {
        return await getInfraLinksWithStopsForGeometry(geometry);
      } catch (err) {
        if (err instanceof MapMatchingNoSegmentError) {
          showDangerToast(t('errors.tooFarFromInfrastructureLink'));
        } else {
          setIsLoading(false);
          throw err;
        }
      } finally {
        setIsLoading(false);
      }
      return undefined;
    },
    [getInfraLinksWithStopsForGeometry, setIsLoading, t],
  );
};
