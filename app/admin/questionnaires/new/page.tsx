import { redirect } from 'next/navigation';

/**
 * Redirect /admin/questionnaires/new to /admin/clients/new
 *
 * Questionnaires are created when clients are created - they're linked together.
 * This redirect ensures users land on the correct page.
 */
export default function NewQuestionnairePage() {
  redirect('/admin/clients/new');
}
