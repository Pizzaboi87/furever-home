import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { normalizeValue } from '../../lib/pet-format'

describe('dashboard monthly application KPIs', () => {
    const selectedMonthApplications = [
        { status: 'approved' },
        { status: 'APPROVED' },
        { status: 'new' },
        { status: 'declined' },
    ]

    it('counts approved applications only inside the already selected month slice', () => {
        const approved = selectedMonthApplications.filter(
            (application) => normalizeValue(application.status) === 'approved',
        )

        assert.equal(approved.length, 2)
    })

    it('uses the selected month slice length as the new application count', () => {
        assert.equal(selectedMonthApplications.length, 4)
    })
})
