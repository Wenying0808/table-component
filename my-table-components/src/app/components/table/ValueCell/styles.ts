import styled from '@emotion/styled';
import { colors } from '../../styles/colors';

export const ValueCellContainer = styled.td<{ depth: number, width: string }>`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 8px;
    height: ${({ depth }) => (depth === 0 ? '46px' : '34px')};
    width: ${({ width }) => (width)};
    font-weight: ${({ depth }) => (depth === 0 ? 600 : depth === 1 ? 500 : 400)};
    color: ${colors.black};

    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;