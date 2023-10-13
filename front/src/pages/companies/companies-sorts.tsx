import { SortDefinition } from '@/ui/Data/View Bar/types/SortDefinition';
import {
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconLink,
  IconMap,
  IconUsers,
} from '@/ui/Display/Icon/index';

export const companyAvailableSorts: SortDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    Icon: IconBuildingSkyscraper,
  },
  {
    key: 'employees',
    label: 'Employees',
    Icon: IconUsers,
  },
  {
    key: 'domainName',
    label: 'Url',
    Icon: IconLink,
  },
  {
    key: 'address',
    label: 'Address',
    Icon: IconMap,
  },
  {
    key: 'createdAt',
    label: 'Creation',
    Icon: IconCalendarEvent,
  },
];
