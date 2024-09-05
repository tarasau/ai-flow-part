import { createEffect, createSignal, For } from 'solid-js';
import { getAll } from '../auth/auth.service';
import { flexRender, getCoreRowModel, ColumnDef, createSolidTable } from '@tanstack/solid-table';
import { format } from 'date-fns';
import { DataItem } from '@shared/modules/flow/types/data.types';
import { useNavigate } from '@solidjs/router';
import { paths } from '../../router/paths';

export const FlowsPage = () => {
  const query = getAll();

  const navigate = useNavigate();

  const [flowsList, setFlowsList] = createSignal(query?.data?.flow || []);
  createEffect(() => {
    setFlowsList(query?.data?.flow || []);
  });

  type Flow = ReturnType<typeof flowsList>[0];

  const defaultColumns: ColumnDef<Flow>[] = [
    {
      accessorKey: 'id',
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
    },
    {
      accessorKey: 'name',
      cell: (info) => info.getValue<string>(),
      header: () => <span>Name</span>,
    },
    {
      accessorKey: 'createdAt',
      cell: (info) => format(info.getValue<string>(), 'PP'),
      header: () => <span>Created At</span>,
    },
    {
      accessorKey: 'schema',
      cell: (info) => info.getValue<DataItem>().id,
      header: () => <span>Schema</span>,
    },
    {
      accessorKey: 'userId',
      cell: (info) => info.getValue<string>(),
      header: () => <span>User ID</span>,
    },
    {
      accessorKey: 'id',
      cell: (info) => {
        return (
          <button onClick={() => navigate(paths.flowDetails(info.getValue<string>()))}>Edit</button>
        );
      },
      header: () => <span>Edit</span>,
    },
  ];

  const table = createSolidTable({
    get data() {
      return flowsList();
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="p-2">
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getVisibleCells()}>
                  {(cell) => <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="h-4" />
    </div>
  );
};
