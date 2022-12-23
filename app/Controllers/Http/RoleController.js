const Role = use('App/Models/Role');
const PermissionRole = use('App/Models/PermissionRole');
const DataTable = use('App/Services/DataTable');
const Access = use('Access')

const NotFoundException = use('App/Exceptions/NotFoundException')

class RoleController {
  async index({ view }) {
    return view.render('admin.data.roles', { permissions: Access })
  }

  async data({ request, response }) {
    const data = request.get();

    const query = Role
      .query()
      .select([
        'roles.id',
        'roles.name'
      ])
      .innerJoin('permission_role', 'roles.id', 'permission_role.role_id')
      .groupByRaw('roles.id');

    const datatable = new DataTable(query, ['roles.name'], data);
    const datatableResponse = await datatable.result();
    return datatableResponse;

    // const { draw, start, length,
    //   search, order, columns } = request.get()
    // const roles = await Role
    //   .query()
    //   .select(columns.map(col => `${col.name} AS ${col.data}`))
    //   .innerJoin('permission_role', 'roles.id', 'permission_role.role_id')
    //   .whereRaw(`LOWER(roles.name) LIKE LOWER('%${search.value}%')`)
    //   .groupByRaw('roles.id')
    //   .orderBy(`${columns[order[0].column].name}`, `${order[0].dir}`)
    //   .paginate(start + 1, length)
    // const data = new DataTableData(draw, roles)
    // return response.json(data)
  }

  async create({ request, response }) {
    const { name, slug, permissions } = request.post();
    const role = await Role.create({
      name, slug
    });

    const data = [].concat(permissions)
      .map((permission) => ({
        role_id: role.id,
        permission_id: parseInt(permission, 10)
      }));

    await PermissionRole.createMany(data);

    return response.redirect('back');
  }

  async show({ params, response }) {
    const { id } = params
    const role = await Role
      .query()
      .with('permissions')
      .where('id', id)
      .first()
    return role.toJSON()
  }

  async update({
    params, request, response, session
  }) {
    const { id } = params
    const { name, permissions } = request.post()

    const role = await Role.find(id)
    if (!role) throw new NotFoundException()

    role.merge({
      name
    })
    await role.save()
    await role.permissions().delete() // delete all role permissions and create specified
    const data = [].concat(permissions)
      .map((permission) => ({
        role_id: role.id,
        permission_id: parseInt(permission, 10)
      }));
    await PermissionRole.createMany(data);

    session.flash({ success: 'Role updated!' })
    return response.redirect('back')
  }

  async destroy({ params, response }) {
    const { id } = params
    await Role
      .query()
      .where('id', id)
      .delete()
    return response.redirect('back')
  }
}

module.exports = RoleController;
