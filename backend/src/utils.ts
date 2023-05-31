import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';

export function sqlContains(
  qb: WhereExpressionBuilder,
  colum: string,
  param: string,
  isAndWhere: boolean = true,
  caseInsensitive: boolean = true,
) {
  const func = isAndWhere ? qb.andWhere.bind(qb) : qb.orWhere.bind(qb);
  const sql = caseInsensitive
    ? `LOWER(${colum}) like '%' || LOWER(:${param}) || '%'`
    : `${colum} like '%' || :${param} || '%'`;
  func(sql);
  return qb;
}

export function sqlNumberRange<T>(
  qb: SelectQueryBuilder<T>,
  colum: string,
  param: string,
  isAndWhere: boolean = true,
) {
  const func = isAndWhere ? qb.andWhere.bind(qb) : qb.orWhere.bind(qb);

  const params = qb.getParameters();
  const values: string[] = params[param].split(',').slice(0, 2);

  if (values.length < 1) {
    return qb;
  } else if (values.length < 2) {
    func(`${colum} = :${param}`);
  } else {
    qb.setParameter(`${param}Ge`, values[0]);
    qb.setParameter(`${param}Le`, values[1]);
    func(
      new Brackets((qb) => {
        if (values[0]) qb.andWhere(`${colum} >= :${param}Ge`);
        if (values[1]) qb.andWhere(`${colum} <= :${param}Le`);
      }),
    );
  }

  return qb;
}
