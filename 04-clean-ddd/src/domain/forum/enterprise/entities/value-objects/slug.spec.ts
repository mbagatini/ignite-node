import { expect, test } from 'vitest'
import { Slug } from './slug'

test('should be able to create a new slug from a text', () => {
    const slug = Slug.createFromText('Some title with spaces')
    expect(slug.value).toBe('some-title-with-spaces')
})
