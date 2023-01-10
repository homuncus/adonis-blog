// import { render as _render } from '@adonisjs/framework/src/View'

$('#roles-table').DataTable({
  processing: true,
  serverSide: true,
  ajax: '/admin/roles/data',
  columns: [
    { data: 'id', searchable: false },
    { data: 'name' },
    {
      orderable: false,
      searchable: false,
      render: (data, type, row) => {
        const markup = `
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-icon dropdown-toggle" data-toggle="dropdown">
              <i class="icon-menu7"></i> &nbsp;<span class="caret"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              ${perms.edit ? `<li><a class="edit-role" data-role-id="${row.id}" data-toggle="modal" data-target="#role-modal"><i class="icon-pencil3"></i> ${transl.edit}</a></li>` : ''}
              ${perms.delete ? `<li><a class="delete-role" data-role-id="${row.id}" data-toggle="modal" data-target="#role-delete"><i class="icon-trash"></i> ${transl.delete}</a></li>` : ''}
            </ul>
          </div>
        `;
        return markup
      }
    }
    // { data: 'permissions', name: 'STRING_AGG(permission_role.permission_id, ", ")' },
  ],

  // order: [[1, 'asc']],
})
