import styled from '@emotion/styled';
import { v4 } from 'uuid';

import { useOptimisticEffect } from '@/apollo/optimistic-effect/hooks/useOptimisticEffect';
import { PeopleTable } from '@/people/table/components/PeopleTable';
import { SpreadsheetImportProvider } from '@/spreadsheet-import/provider/components/SpreadsheetImportProvider';
import { DataTableActionBar } from '@/ui/Data/Data Table/action-bar/components/DataTableActionBar';
import { DataTableContextMenu } from '@/ui/Data/Data Table/context-menu/components/DataTableContextMenu';
import { useUpsertDataTableItem } from '@/ui/Data/Data Table/hooks/useUpsertDataTableItem';
import { useUpsertTableRowId } from '@/ui/Data/Data Table/hooks/useUpsertTableRowId';
import { TableRecoilScopeContext } from '@/ui/Data/Data Table/states/recoil-scope-contexts/TableRecoilScopeContext';
import { IconUser } from '@/ui/Display/Icon';
import { PageAddButton } from '@/ui/Layout/Page/PageAddButton';
import { PageBody } from '@/ui/Layout/Page/PageBody';
import { PageContainer } from '@/ui/Layout/Page/PageContainer';
import { PageHeader } from '@/ui/Layout/Page/PageHeader';
import { PageHotkeysEffect } from '@/ui/Layout/Page/PageHotkeysEffect';
import { RecoilScope } from '@/ui/utilities/recoil-scope/components/RecoilScope';
import { useInsertOnePersonMutation } from '~/generated/graphql';

const StyledTableContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const People = () => {
  const [insertOnePerson] = useInsertOnePersonMutation();
  const upsertDataTableItem = useUpsertDataTableItem();
  const upsertTableRowIds = useUpsertTableRowId();
  const { triggerOptimisticEffects } = useOptimisticEffect();

  const handleAddButtonClick = async () => {
    const newPersonId: string = v4();
    await insertOnePerson({
      variables: {
        data: {
          id: newPersonId,
          firstName: '',
          lastName: '',
        },
      },
      update: (_cache, { data }) => {
        if (data?.createOnePerson) {
          upsertTableRowIds(data?.createOnePerson.id);
          upsertDataTableItem(data?.createOnePerson);
          triggerOptimisticEffects('Person', [data?.createOnePerson]);
        }
      },
    });
  };

  return (
    <SpreadsheetImportProvider>
      <PageContainer>
        <PageHeader title="People" Icon={IconUser}>
          <PageHotkeysEffect onAddButtonClick={handleAddButtonClick} />
          <PageAddButton onClick={handleAddButtonClick} />
        </PageHeader>
        <PageBody>
          <RecoilScope
            scopeId="people"
            CustomRecoilScopeContext={TableRecoilScopeContext}
          >
            <StyledTableContainer>
              <PeopleTable />
            </StyledTableContainer>
            <DataTableActionBar />
            <DataTableContextMenu />
          </RecoilScope>
        </PageBody>
      </PageContainer>
    </SpreadsheetImportProvider>
  );
};
