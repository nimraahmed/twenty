import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import {
  IconChevronRight,
  IconDotsVertical,
  IconPlus,
  IconSettings,
} from '@/ui/Display/Icon';
import { Tag } from '@/ui/Display/Tag/components/Tag';
import { H1Title } from '@/ui/Display/Typography/components/H1Title';
import { H2Title } from '@/ui/Display/Typography/components/H2Title';
import { Button } from '@/ui/Input/Button/components/Button';
import { SubMenuTopBarContainer } from '@/ui/Layout/Page/SubMenuTopBarContainer';
import { Table } from '@/ui/Layout/Table/components/Table';
import { TableCell } from '@/ui/Layout/Table/components/TableCell';
import { TableHeader } from '@/ui/Layout/Table/components/TableHeader';
import { TableRow } from '@/ui/Layout/Table/components/TableRow';
import { TableSection } from '@/ui/Layout/Table/components/TableSection';

import {
  activeObjectItems,
  disabledObjectItems,
} from './constants/mockObjects';
import { objectSettingsWidth } from './constants/objectSettings';

const StyledContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  width: ${objectSettingsWidth};
`;

const StyledTableRow = styled(TableRow)`
  grid-template-columns: 180px 98.7px 98.7px 98.7px 36px;
`;

const StyledNameTableCell = styled(TableCell)`
  color: ${({ theme }) => theme.font.color.primary};
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledTag = styled(Tag)`
  box-sizing: border-box;
  height: ${({ theme }) => theme.spacing(4)};
`;

const StyledIconTableCell = styled(TableCell)`
  justify-content: center;
  padding-right: ${({ theme }) => theme.spacing(1)};
`;

const StyledIconChevronRight = styled(IconChevronRight)`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledIconDotsVertical = styled(IconDotsVertical)`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const StyledH1Title = styled(H1Title)`
  margin-bottom: 0;
`;

export const SettingsObjects = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <SubMenuTopBarContainer Icon={IconSettings} title="Settings">
      <StyledContainer>
        <StyledHeader>
          <StyledH1Title title="Objects" />
          <Button
            Icon={IconPlus}
            title="New object"
            accent="blue"
            size="small"
            onClick={() => {
              navigate('/settings/objects/new');
            }}
          />
        </StyledHeader>
        <H2Title title="Existing objects" />
        <Table>
          <StyledTableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader align="right">Fields</TableHeader>
            <TableHeader align="right">Instances</TableHeader>
            <TableHeader></TableHeader>
          </StyledTableRow>
          <TableSection title="Active">
            {activeObjectItems.map((objectItem) => (
              <StyledTableRow
                key={objectItem.name}
                onClick={() =>
                  navigate(`/settings/objects/${objectItem.name.toLowerCase()}`)
                }
              >
                <StyledNameTableCell>
                  <objectItem.Icon size={theme.icon.size.md} />
                  {objectItem.name}
                </StyledNameTableCell>
                <TableCell>
                  {objectItem.type === 'standard' ? (
                    <StyledTag color="blue" text="Standard" />
                  ) : (
                    <StyledTag color="orange" text="Custom" />
                  )}
                </TableCell>
                <TableCell align="right">{objectItem.fields}</TableCell>
                <TableCell align="right">{objectItem.instances}</TableCell>
                <StyledIconTableCell>
                  <StyledIconChevronRight
                    size={theme.icon.size.md}
                    stroke={theme.icon.stroke.sm}
                  />
                </StyledIconTableCell>
              </StyledTableRow>
            ))}
          </TableSection>
          {!!disabledObjectItems.length && (
            <TableSection title="Disabled">
              {disabledObjectItems.map((objectItem) => (
                <StyledTableRow key={objectItem.name}>
                  <StyledNameTableCell>
                    <objectItem.Icon size={theme.icon.size.md} />
                    {objectItem.name}
                  </StyledNameTableCell>
                  <TableCell>
                    {objectItem.type === 'standard' ? (
                      <StyledTag color="blue" text="Standard" />
                    ) : (
                      <StyledTag color="orange" text="Custom" />
                    )}
                  </TableCell>
                  <TableCell align="right">{objectItem.fields}</TableCell>
                  <TableCell align="right">{objectItem.instances}</TableCell>
                  <StyledIconTableCell>
                    <StyledIconDotsVertical
                      size={theme.icon.size.md}
                      stroke={theme.icon.stroke.sm}
                    />
                  </StyledIconTableCell>
                </StyledTableRow>
              ))}
            </TableSection>
          )}
        </Table>
      </StyledContainer>
    </SubMenuTopBarContainer>
  );
};
