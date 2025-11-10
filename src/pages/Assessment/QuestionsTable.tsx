import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export default function QuestionsTable() {
  return (
    <div>
      <Table
        aria-label="subject table"
        className="pt-4"
        color="warning"
        defaultSelectedKeys={[]}
        selectionMode="multiple"
      >
        <TableHeader>
          <TableColumn>Questions</TableColumn>
          <TableColumn>Topic</TableColumn>
          <TableColumn>Difficulty</TableColumn>
          <TableColumn>Marks</TableColumn>
          <TableColumn>Time</TableColumn>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
            <TableCell>Loremm eehehe</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
