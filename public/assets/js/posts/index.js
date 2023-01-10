$('#posts-table').DataTable({
  processing: true,
  serverSide: true,
  ajax: '/admin/posts/data',
  columns: [
    { data: 'id', searchable: false },
    { data: 'title' },
    { data: 'username' },
    { data: 'creationDate', searchable: false, orderable: false },
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
              ${perms.edit ? `<li><a class="edit-post" data-post-id="${row.id}" data-toggle="modal" data-target="#post-modal"><i class="icon-pencil3"></i> ${transl.edit}</a></li>` : ''}
              ${perms.delete ? `<li><a class="delete-post" data-post-id="${row.id}" data-toggle="modal" data-target="#post-delete"><i class="icon-trash"></i> ${transl.delete}</a></li>` : ''}              
            </ul>
          </div>
        `;
        return markup
      }
    }
  ],
});
