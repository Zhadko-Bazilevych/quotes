import {
  type ExpressionBuilder,
  type ExpressionWrapper,
  type RawBuilder,
  sql,
  type SqlBool,
  type StringReference,
} from 'kysely';
import { type defineAbilityFor } from 'src/auth/permissions/define-ability-for';
import { type AppAbility } from 'src/auth/permissions/permission.types';
import { type Database } from 'src/database/kysely.service';

import { rulesToAST } from '@casl/ability/extra';
import { CompoundCondition, type Condition, FieldCondition } from '@ucast/core';

type Table = keyof Database;

type Expression<T extends keyof Database> = (
  eb: ExpressionBuilder<Database, T>,
) => ExpressionWrapper<Database, T, SqlBool>;

export function kyselyWhere<TTable extends Table>(
  ability: AppAbility,
  action: Parameters<ReturnType<typeof defineAbilityFor>['rulesFor']>[0],
  subject: Parameters<ReturnType<typeof defineAbilityFor>['rulesFor']>[1],
): Expression<TTable> | RawBuilder<boolean> {
  const ast = rulesToAST<AppAbility>(ability, action, subject);
  if (ast === null) {
    return sql<boolean>`false`;
  }

  return (eb) => getConditionSql<TTable>(ast, eb);
}

function getConditionSql<TTableName extends Table>(
  condition: Condition,
  eb: ExpressionBuilder<Database, TTableName>,
): ExpressionWrapper<Database, TTableName, SqlBool> {
  if (condition instanceof CompoundCondition) {
    switch (condition.operator) {
      case 'and':
        return eb.and(
          condition.value.map((cond: Condition) => getConditionSql(cond, eb)),
        );
      case 'or':
        return eb.or(
          condition.value.map((cond: Condition) => getConditionSql(cond, eb)),
        );
      case 'not':
        return eb.not(getConditionSql(condition.value[0] as Condition, eb));
      default: {
        throw new Error(
          `Unsupported compound condition operator: ${condition.operator}`,
        );
      }
    }
  } else if (condition instanceof FieldCondition) {
    switch (condition.operator) {
      case 'eq':
        return eb(
          eb.ref(condition.field as StringReference<Database, TTableName>),
          '=',
          condition.value,
        );
      default: {
        throw new Error(
          `Unsupported field condition operator: ${condition.operator}`,
        );
      }
    }
  }
  throw new Error(`Unsupported condition type: ${condition.constructor.name}`);
}
