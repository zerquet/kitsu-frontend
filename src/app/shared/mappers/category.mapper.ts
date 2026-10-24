import { GetCategoryResponseDto } from "../../features/anime/dtos/get-category-response.dto";
import { Category } from "../models/category.model";

export function mapGetCategoryToCategory(dto: GetCategoryResponseDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    slug: dto.slug
  }
}