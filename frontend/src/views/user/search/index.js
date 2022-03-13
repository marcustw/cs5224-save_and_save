// project imports
import { InfiniteProductLoader } from 'ui-component/InfiniteProductLoader';
import SearchSection from 'ui-component/SearchSection';

import { useProductStore } from 'hooks/useProductStore';

const SearchPage = () => {
  const { productListRef, loadMoreRows } = useProductStore();

  const onAddToCart = (item, count) => {
    console.log(count, item);
  };

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <SearchSection />
      <InfiniteProductLoader
        list={productListRef.current}
        onBuyerActionClick={onAddToCart}
        totalRowCounts={100}
        loadMoreRows={loadMoreRows}
      />
    </div>
  );
};

export default SearchPage;
