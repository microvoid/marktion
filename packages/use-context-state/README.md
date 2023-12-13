# use-context-state

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
