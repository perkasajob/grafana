import { findSelected, getFlattenedSections, markSelected, mergeReducers } from './utils';
import { DashboardSection } from './types';
import { sections } from './testData';

describe('Search utils', () => {
  describe('getFlattenedSections', () => {
    it('should return an array of items plus children for expanded items', () => {
      const flatSections = getFlattenedSections(sections as DashboardSection[]);
      expect(flatSections).toHaveLength(10);
      expect(flatSections).toEqual([
        'Starred',
        'Starred-1',
        'Recent',
        '2',
        '2568',
        '4074',
        '0',
        '0-4069',
        '0-4072',
        '0-1',
      ]);
    });

    describe('markSelected', () => {
      it('should correctly mark the section item without id as selected', () => {
        const results = markSelected(sections as any, 'Recent');
        //@ts-ignore
        expect(results[1].selected).toBe(true);
      });

      it('should correctly mark the section item with id as selected', () => {
        const results = markSelected(sections as any, '4074');
        //@ts-ignore
        expect(results[4].selected).toBe(true);
      });

      it('should mark all other sections as not selected', () => {
        const results = markSelected(sections as any, 'Starred');
        const newResults = markSelected(results as any, '0');
        //@ts-ignore
        expect(newResults[0].selected).toBeFalsy();
        expect(newResults[5].selected).toBeTruthy();
      });

      it('should correctly mark an item of a section as selected', () => {
        const results = markSelected(sections as any, '0-4072');
        expect(results[5].items[1].selected).toBeTruthy();
      });

      it('should not mark an item as selected for non-expanded section', () => {
        const results = markSelected(sections as any, 'Recent-4072');
        expect(results[1].items[0].selected).toBeFalsy();
      });

      it('should mark all other items as not selected', () => {
        const results = markSelected(sections as any, '0-4069');
        const newResults = markSelected(results as any, '0-1');
        //@ts-ignore
        expect(newResults[5].items[0].selected).toBeFalsy();
        expect(newResults[5].items[1].selected).toBeFalsy();
        expect(newResults[5].items[2].selected).toBeTruthy();
      });

      it('should correctly select one of the same items in different sections', () => {
        const results = markSelected(sections as any, 'Starred-1');
        expect(results[0].items[0].selected).toBeTruthy();
        // Same item in diff section
        expect(results[5].items[2].selected).toBeFalsy();

        // Switch order
        const newResults = markSelected(sections as any, '0-1');
        expect(newResults[0].items[0].selected).toBeFalsy();
        // Same item in diff section
        expect(newResults[5].items[2].selected).toBeTruthy();
      });
    });

    describe('findSelected', () => {
      it('should find selected section', () => {
        const results = [...sections, { id: 'Test', selected: true }];

        const found = findSelected(results);
        expect(found.id).toEqual('Test');
      });

      it('should find selected item', () => {
        const results = [{ expanded: true, id: 'Test', items: [{ id: 1 }, { id: 2, selected: true }, { id: 3 }] }];

        const found = findSelected(results);
        expect(found.id).toEqual(2);
      });
    });
  });

  describe('mergeReducers', () => {
    const reducer1 = (state: any = { reducer1: false }, action: any) => {
      if (action.type === 'reducer1') {
        return { ...state, reducer1: !state.reducer1 };
      }
      return state;
    };

    const reducer2 = (state: any = { reducer2: false }, action: any) => {
      if (action.type === 'reducer2') {
        return { ...state, reducer2: !state.reducer2 };
      }
      return state;
    };

    const mergedReducers = mergeReducers([reducer1, reducer2]);

    it('should merge state from all reducers into one without nesting', () => {
      expect(mergedReducers({ reducer1: false }, { type: '' })).toEqual({ reducer1: false });
    });

    it('should correctly set state from multiple reducers', () => {
      const state = { reducer1: false, reducer2: true };
      const newState = mergedReducers(state, { type: 'reducer2' });
      expect(newState).toEqual({ reducer1: false, reducer2: false });
      const newState2 = mergedReducers(newState, { type: 'reducer1' });
      expect(newState2).toEqual({ reducer1: true, reducer2: false });
    });
  });
});