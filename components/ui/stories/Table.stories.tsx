import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

const meta: Meta = {
  title: 'UI/Table',
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Income Range</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead className="text-right">Tax Owed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>$0 – $50,197</TableCell>
          <TableCell>15%</TableCell>
          <TableCell className="text-right">$7,529.55</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>$50,197 – $100,392</TableCell>
          <TableCell>20.5%</TableCell>
          <TableCell className="text-right">$10,209.62</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$17,739.17</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
