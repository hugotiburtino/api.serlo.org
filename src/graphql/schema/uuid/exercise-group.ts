import { Schema } from '../utils'
import {
  addEntityResolvers,
  EntityPayload,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from './abstract-entity'
import { TaxonomyTermChild } from './abstract-taxonomy-term-child'
import { GroupedExercise } from './grouped-exercise'
import { TaxonomyTerm } from './taxonomy-term'

export const exerciseGroupSchema = new Schema()

export class ExerciseGroup extends TaxonomyTermChild {
  public __typename = EntityType.ExerciseGroup
  public exerciseIds: number[]

  public constructor(payload: ExerciseGroupPayload) {
    super(payload)
    this.exerciseIds = payload.exerciseIds
  }
}
export interface ExerciseGroupPayload extends EntityPayload {
  taxonomyTermIds: number[]
  exerciseIds: number[]
}
exerciseGroupSchema.addResolver<ExerciseGroup, unknown, TaxonomyTerm[]>(
  'ExerciseGroup',
  'taxonomyTerms',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.taxonomyTermIds.map((id: number) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return new TaxonomyTerm(data)
        })
      })
    )
  }
)
exerciseGroupSchema.addResolver<ExerciseGroup, unknown, GroupedExercise[]>(
  'ExerciseGroup',
  'exercises',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.exerciseIds.map((id: number) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return new GroupedExercise(data)
        })
      })
    )
  }
)

export class ExerciseGroupRevision extends EntityRevision {
  public __typename = EntityRevisionType.ExerciseGroupRevision
  public content: string
  public changes: string

  public constructor(payload: ExerciseGroupRevisionPayload) {
    super(payload)
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface ExerciseGroupRevisionPayload extends EntityRevisionPayload {
  content: string
  changes: string
}

addEntityResolvers({
  schema: exerciseGroupSchema,
  entityType: EntityType.ExerciseGroup,
  entityRevisionType: EntityRevisionType.ExerciseGroupRevision,
  repository: 'exerciseGroup',
  Entity: ExerciseGroup,
  EntityRevision: ExerciseGroupRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
    exercises: [GroupedExercise!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
    exerciseIds: [Int!]!
  `,
  entityRevisionFields: `
    content: String!
    changes: String!
  `,
  entitySetter: 'setExerciseGroup',
  entityRevisionSetter: 'setExerciseGroupRevision',
})
