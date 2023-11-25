import { createContext, useContextSelector } from 'use-context-selector';
import { Article, api } from './api';
import { useCallback, useEffect, useState } from 'react';

export type MainContextType = {
  articles: Article[];
  draft: Article | null;

  refreshArticles: () => void;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  setDraft: React.Dispatch<React.SetStateAction<Article | null>>;
};

const MainContext = createContext<MainContextType>({} as MainContextType);

export function useMainContextSelector<S>(selector: (ctx: MainContextType) => S): S {
  return useContextSelector(MainContext, selector);
}

export function MainContextProvider({ children }: React.PropsWithChildren) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [draft, setDraft] = useState<Article | null>(null);

  const refreshArticles = useCallback(() => {
    api.getArticles().then(setArticles);
  }, []);

  useEffect(() => {
    refreshArticles();
  }, []);

  return (
    <MainContext.Provider
      value={{
        articles,
        draft,
        setDraft,
        setArticles,

        refreshArticles
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
