import type { BusinessCanvasComponent } from '../output-models'
import type { BaseModel } from './util/base-model'

export interface BusinessCanvasModel extends BaseModel {
  name: string
  userId: string
  components: Record<BusinessCanvasComponent, string[]>
}
