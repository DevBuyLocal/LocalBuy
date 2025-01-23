import React, { useState } from 'react';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';

/* ORDER MANAGEMENT COMPONENT - HANDLES ORDER SEARCH AND DISPLAY */
function ManageOrder() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container.Page headerTitle="Manage Orders" showHeader>
      <Container.Box containerClassName="-pt-1">
        <CustomInput
          placeholder="Search by item"
          value={searchQuery}
          isSearch
          onChangeText={setSearchQuery}
        />
      </Container.Box>
    </Container.Page>
  );
}

export default ManageOrder;
