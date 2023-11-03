import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { useSnackBar } from '@/ui/feedback/snack-bar/hooks/useSnackBar';
import {
  ObjectMetadataItemsQuery,
  ObjectMetadataItemsQueryVariables,
} from '~/generated-metadata/graphql';
import { logError } from '~/utils/logError';

import { FIND_MANY_METADATA_OBJECTS } from '../graphql/queries';
import { formatPagedObjectMetadataItemsToObjectMetadataItems } from '../utils/formatPagedObjectMetadataItemsToObjectMetadataItems';

import { useApolloMetadataClient } from './useApolloMetadataClient';

// TODO: test fetchMore
export const useFindManyObjectMetadataItems = ({
  skip,
}: { skip?: boolean } = {}) => {
  const apolloMetadataClient = useApolloMetadataClient();

  const { enqueueSnackBar } = useSnackBar();

  const {
    data,
    fetchMore: fetchMoreInternal,
    loading,
    error,
  } = useQuery<ObjectMetadataItemsQuery, ObjectMetadataItemsQueryVariables>(
    FIND_MANY_METADATA_OBJECTS,
    {
      client: apolloMetadataClient ?? undefined,
      skip: skip || !apolloMetadataClient,
      onError: (error) => {
        logError('useFindManyObjectMetadataItems error : ' + error);
        enqueueSnackBar(
          `Error during useFindManyObjectMetadataItems, ${error.message}`,
          {
            variant: 'error',
          },
        );
      },
      onCompleted: () => {},
    },
  );

  const hasMore = data?.objects?.pageInfo?.hasNextPage;

  const fetchMore = () =>
    fetchMoreInternal({
      variables: {
        afterCursor: data?.objects?.pageInfo?.endCursor,
      },
    });

  const objectMetadataItems = useMemo(() => {
    return formatPagedObjectMetadataItemsToObjectMetadataItems({
      pagedObjectMetadataItems: data,
    });
  }, [data]);

  return {
    objectMetadataItems,
    hasMore,
    fetchMore,
    loading,
    error,
  };
};
