# use-channel

```typescript
// editor.tsx

export const EditArticleChannel = createChannel<Article[]>();

function Editor() {
  const [current, setCurrent] = useState<Article | null>(null);
  const channel = useChannel(EditArticleChannel);

  useEffect(() => {
    const followArticle = channel.messages().pop();

    if (followArticle && followArticle != current) {
      setCurrent(followArticle);
    }

  }, [channel, article])

  useEffect(() => {
    channel.message(props.value);
  }, [props.value])
}
```

```typescript
function ArticleList() {
  const channel = useChannel(EditArticleChannel);

  const onEditItem = () => {
    channel.message(props.value);
  }
}
```
