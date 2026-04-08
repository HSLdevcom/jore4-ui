import { KnownValueKey } from '../../../utils/knownValueKey';
import {
  getMirrorParentId,
  isMirrorChild,
  setMirrorParent,
} from './mirrorRelation';

describe('Mirror relation utils', () => {
  describe('getMirrorParentId', () => {
    it('should return parent netexId when mirrors key exists', () => {
      const quay = {
        keyValues: [{ key: KnownValueKey.Mirrors, values: ['NSR:Quay:123'] }],
      };
      expect(getMirrorParentId(quay)).toBe('NSR:Quay:123');
    });

    it('should return null when no mirrors key exists', () => {
      const quay = {
        keyValues: [{ key: 'someOtherKey', values: ['value'] }],
      };
      expect(getMirrorParentId(quay)).toBeNull();
    });

    it('should return null for empty keyValues', () => {
      expect(getMirrorParentId({ keyValues: [] })).toBeNull();
      expect(getMirrorParentId({ keyValues: undefined })).toBeNull();
    });
  });

  describe('isMirrorChild', () => {
    it('should return true when quay has mirrors key', () => {
      const quay = {
        keyValues: [{ key: KnownValueKey.Mirrors, values: ['NSR:Quay:123'] }],
      };
      expect(isMirrorChild(quay)).toBe(true);
    });

    it('should return false when quay has no mirrors key', () => {
      expect(isMirrorChild({ keyValues: [] })).toBe(false);
    });
  });

  describe('setMirrorParent', () => {
    it('should set mirrors key on empty keyValues', () => {
      const result = setMirrorParent([], 'NSR:Quay:123');
      expect(result).toEqual([
        { key: KnownValueKey.Mirrors, values: ['NSR:Quay:123'] },
      ]);
    });

    it('should update existing mirrors key', () => {
      const existing = [
        { key: KnownValueKey.Mirrors, values: ['NSR:Quay:old'] },
      ];
      const result = setMirrorParent(existing, 'NSR:Quay:new');
      expect(result).toEqual([
        { key: KnownValueKey.Mirrors, values: ['NSR:Quay:new'] },
      ]);
    });

    it('should preserve other keyValues', () => {
      const existing = [{ key: 'otherKey', values: ['otherValue'] }];
      const result = setMirrorParent(existing, 'NSR:Quay:123');
      expect(result).toEqual([
        { key: 'otherKey', values: ['otherValue'] },
        { key: KnownValueKey.Mirrors, values: ['NSR:Quay:123'] },
      ]);
    });
  });
});
