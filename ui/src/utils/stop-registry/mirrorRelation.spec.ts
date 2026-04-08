import { KnownValueKey } from '../knownValueKey';
import {
  addMirroredBy,
  getMirrorParentId,
  getMirroredByIds,
  isMirrorChild,
  isMirrorParent,
  removeMirroredBy,
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

  describe('getMirroredByIds', () => {
    it('should return list of child netexIds', () => {
      const quay = {
        keyValues: [
          {
            key: KnownValueKey.MirroredBy,
            values: ['NSR:Quay:456', 'NSR:Quay:789'],
          },
        ],
      };
      expect(getMirroredByIds(quay)).toEqual(['NSR:Quay:456', 'NSR:Quay:789']);
    });

    it('should return empty array when no mirroredBy key', () => {
      const quay = { keyValues: [] };
      expect(getMirroredByIds(quay)).toEqual([]);
    });

    it('should filter out null/undefined values', () => {
      const quay = {
        keyValues: [
          {
            key: KnownValueKey.MirroredBy,
            values: ['NSR:Quay:456', null, 'NSR:Quay:789'],
          },
        ],
      };
      expect(getMirroredByIds(quay)).toEqual(['NSR:Quay:456', 'NSR:Quay:789']);
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

  describe('isMirrorParent', () => {
    it('should return true when quay has mirroredBy key with values', () => {
      const quay = {
        keyValues: [
          { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
        ],
      };
      expect(isMirrorParent(quay)).toBe(true);
    });

    it('should return false when mirroredBy is empty', () => {
      const quay = {
        keyValues: [{ key: KnownValueKey.MirroredBy, values: [] }],
      };
      expect(isMirrorParent(quay)).toBe(false);
    });

    it('should return false when no mirroredBy key', () => {
      expect(isMirrorParent({ keyValues: [] })).toBe(false);
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

  describe('addMirroredBy', () => {
    it('should add first child to empty keyValues', () => {
      const result = addMirroredBy([], 'NSR:Quay:456');
      expect(result).toEqual([
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ]);
    });

    it('should append to existing mirroredBy list', () => {
      const existing = [
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ];
      const result = addMirroredBy(existing, 'NSR:Quay:789');
      expect(result).toEqual([
        {
          key: KnownValueKey.MirroredBy,
          values: ['NSR:Quay:456', 'NSR:Quay:789'],
        },
      ]);
    });

    it('should not duplicate existing child', () => {
      const existing = [
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ];
      const result = addMirroredBy(existing, 'NSR:Quay:456');
      expect(result).toEqual([
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ]);
    });

    it('should preserve other keyValues', () => {
      const existing = [{ key: 'otherKey', values: ['otherValue'] }];
      const result = addMirroredBy(existing, 'NSR:Quay:456');
      expect(result).toEqual([
        { key: 'otherKey', values: ['otherValue'] },
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ]);
    });
  });

  describe('removeMirroredBy', () => {
    it('should remove child from mirroredBy list', () => {
      const existing = [
        {
          key: KnownValueKey.MirroredBy,
          values: ['NSR:Quay:456', 'NSR:Quay:789'],
        },
      ];
      const result = removeMirroredBy(existing, 'NSR:Quay:456');
      expect(result).toEqual([
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:789'] },
      ]);
    });

    it('should result in empty values when removing last child', () => {
      const existing = [
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ];
      const result = removeMirroredBy(existing, 'NSR:Quay:456');
      expect(result).toEqual([{ key: KnownValueKey.MirroredBy, values: [] }]);
    });

    it('should be no-op when child not in list', () => {
      const existing = [
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ];
      const result = removeMirroredBy(existing, 'NSR:Quay:999');
      expect(result).toEqual([
        { key: KnownValueKey.MirroredBy, values: ['NSR:Quay:456'] },
      ]);
    });
  });
});
