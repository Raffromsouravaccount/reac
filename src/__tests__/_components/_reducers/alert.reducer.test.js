import alert from '../../../_reducers/alert.reducer';
import { alertConstants } from '../../../_constants/alert.constants';

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(alert(undefined, {})).toEqual([
      {
        
      }
    ])
  })

  it('should handle Success', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    ])
  })
})