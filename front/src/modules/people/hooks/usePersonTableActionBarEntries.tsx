import { getOperationName } from '@apollo/client/utilities';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useResetTableRowSelection } from '@/ui/Data/Data Table/hooks/useResetTableRowSelection';
import { selectedRowIdsSelector } from '@/ui/Data/Data Table/states/selectors/selectedRowIdsSelector';
import { tableRowIdsState } from '@/ui/Data/Data Table/states/tableRowIdsState';
import { IconCheckbox, IconNotes, IconTrash } from '@/ui/Display/Icon';
import { actionBarEntriesState } from '@/ui/Navigation/Action Bar/states/actionBarEntriesState';
import { ActivityType, useDeleteManyPersonMutation } from '~/generated/graphql';

import { GET_PEOPLE } from '../graphql/queries/getPeople';

import { useCreateActivityForPeople } from './useCreateActivityForPeople';

export const usePersonTableActionBarEntries = () => {
  const selectedRowIds = useRecoilValue(selectedRowIdsSelector);
  const [tableRowIds, setTableRowIds] = useRecoilState(tableRowIdsState);
  const setActionBarEntries = useSetRecoilState(actionBarEntriesState);
  const createActivityForPeople = useCreateActivityForPeople();

  const resetRowSelection = useResetTableRowSelection();

  const [deleteManyPerson] = useDeleteManyPersonMutation({
    refetchQueries: [getOperationName(GET_PEOPLE) ?? ''],
  });

  const handleDeleteClick = async () => {
    const rowIdsToDelete = selectedRowIds;

    resetRowSelection();

    await deleteManyPerson({
      variables: {
        ids: rowIdsToDelete,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        deleteManyPerson: {
          count: rowIdsToDelete.length,
        },
      },
      update: (cache) => {
        setTableRowIds(
          tableRowIds.filter((id) => !rowIdsToDelete.includes(id)),
        );
        rowIdsToDelete.forEach((id) => {
          cache.evict({ id: cache.identify({ id, __typename: 'Person' }) });
          cache.gc();
        });
      },
    });
  };

  return {
    setActionBarEntries: () =>
      setActionBarEntries([
        {
          label: 'Note',
          Icon: IconNotes,
          onClick: () => createActivityForPeople(ActivityType.Note),
        },
        {
          label: 'Task',
          Icon: IconCheckbox,
          onClick: () => createActivityForPeople(ActivityType.Task),
        },
        {
          label: 'Delete',
          Icon: IconTrash,
          accent: 'danger',
          onClick: () => handleDeleteClick(),
        },
      ]),
  };
};
