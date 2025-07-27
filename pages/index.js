import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const loader = useRef(null);

  // 初回＆ページ更新時にフェッチ
  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(`/api/items?page=${page}`);
      const newItems = await res.json();
      if (newItems.length > 0) {
        setItems(prev => {
          const combined = [...prev, ...newItems];
          // 最大 100 件を超えたら先頭から 10 件を削除
          if (combined.length > 100) {
            return combined.slice(combined.length - 100);
          }
          return combined;
        });
      }
    };
    fetchItems();
  }, [page]);

  // Intersection Observer でスクロール末尾を検知
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: '200px' }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>アイテム一覧</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0' }}>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <div ref={loader} style={{ textAlign: 'center', padding: 20 }}>
        ローディング...
      </div>
    </div>
  );
}