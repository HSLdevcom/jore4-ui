import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useExtractRouteFromFeature, useLoader } from '..';
import { Operation } from '../../redux';
import { MapMatchingNoSegmentError, showDangerToast } from '../../utils';

export const useFetchInfraLinksWithStops = () => {
  const { setIsLoading } = useLoader(Operation.LoadMap);
  const { t } = useTranslation();
  const { getInfraLinksWithStopsForGeometry } = useExtractRouteFromFeature();

  return useCallback(
    async (geometry: GeoJSON.LineString) => {
      setIsLoading(true);
      try {
        const response = await getInfraLinksWithStopsForGeometry(geometry);
        return response;
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
