# use-context-immer

quick start

```typescript
const TodoContext = createContext();


function Todo() {
  const todos = useSelector(TodoContext, ctx => ctx.model.todos);
  const dispath = useSelector(TodoContext, ctx => ctx.dispath);

  const onCommit = () => {
    dispath(model => {
      model.todos[0].check = true;
    })
  }
}

function App() {
  return <TodoContext.Provider><Todo /></TodoContext.Provider>
}
```

```typescript
class AppState {
  style = {
    theme: 'light',
    primary: 'tomato'
  };
}

const AppStateContext = createContext(new AppState());

const setDarkMode = produce(draft => {
  draft.style.theme = 'dark';
});

const getThemeMode = (state: AppState) => {
  return state.style.theme;
};

function App() {
  const dispatch = useDispatch();
  const theme = useContextSelector(getThemeMode);

  const onToggle = () => {
    dispatch(setDarkMode);
  };

  return (
    <div>
      theme: {theme}
      <button onClick={onToggle}>Toggle Mode</button>
    </div>
  );
}

render(
  <AppStateContext>
    <App />
  </AppStateContext>,
  rootEl
);
```
