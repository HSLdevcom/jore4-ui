export enum StopPlaceState {
  InOperation = 'InOperation',
  OutOfOperation = 'OutOfOperation',
  PermanentlyOutOfOperation = 'PermanentlyOutOfOperation',
  Removed = 'Removed',
}

export enum StopPlaceSignType {
  None = 'None',
  StopSign = 'StopSign',
  CanopyFrame = 'CanopyFrame',
  PoleSign = 'PoleSign',
  JokerSign = 'JokerSign',
  Minibuses = 'Minibuses',
}

/**
 * Subset of @StopRegistryTransportModeType, which is a generated enum from tiamat
 * and we do not use all of the types in Jore
 */
export enum JoreStopRegistryTransportModeType {
  Bus = 'bus',
  Tram = 'tram',
  Metro = 'metro',
  Rail = 'rail',
  Water = 'water',
}

export enum StopOwner {
  Municipality = 'municipality',
  Finavia = 'finavia',
  Hkl = 'hkl',
  Hkr = 'hkr',
  Vr = 'vr',
  Ely = 'ely',
  FinnishTransportAgency = 'finnishTransportAgency',
  PrivateRoad = 'privateRoad',
  Other = 'other',
}
