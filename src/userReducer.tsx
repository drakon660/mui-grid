// App.tsx
import React, { useReducer } from 'react';
import MyButton from './MyButton';

interface State {
  items: string[];
  isDisabled: boolean;
}

type Action = { type: 'ADD_ITEM'; item: string } | { type: 'REMOVE_ITEM'; index: number };

const initialState: State = {
  items: [],
  isDisabled: true,
};


let updatesMap = new Map(updates.map(item => [item.accountNumber, item.code]));

list.forEach(item => {
  if (updatesMap.has(item.accountNumber)) {
    item.code = updatesMap.get(item.accountNumber)!;
  }
});

list.forEach(item => {
  let update = updates.find(update => update.accountNumber === item.accountNumber);
  if (update) {
    item.code = update.code;
  }
});

interface Account{
  accountNumber:number,
  text:string
  code: string
}

let list:Account[] = [{
accountNumber:1,
text:'sample1',
code:'abc'
},{
  accountNumber:2,
  text:'sample2',
  code:'efg'
  },{
    accountNumber:3,
    text:'sample3',
    code:'jkl'
    }]

let updates:Account[] = [{
  accountNumber:2,
  text:'sample2',
  code:'111'
  }]

  updates.with

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.item];
      return {
        ...state,
        items: newItems,
        isDisabled: newItems.length === 0,
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((_, index) => index !== action.index);
      return {
        ...state,
        items: newItems,
        isDisabled: newItems.length === 0,
      };
    }
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = () => {
    const newItem = `Item ${state.items.length + 1}`;
    dispatch({ type: 'ADD_ITEM', item: newItem });
  };

  const removeItem = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', index });
  };

  return (
    <div>
      <MyButton disabled={state.isDisabled}>Click Me</MyButton>
      <button onClick={addItem}>Add Item</button>
      {state.items.map((item, index) => (
        <div key={index}>
          {item} <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default App;