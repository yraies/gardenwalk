# Garden Walk

Garden Walk is the domain context for a privacy-first conversation starter tool that helps people structure, fill, share, and read sensitive personal reflection documents.

## Language

**Artifact**:
Any saved Garden Walk object that can be accessed directly, shared, exported, imported, or deleted. A **Template** and a **Form** are both artifacts.
_Avoid_: Document, file

**Template**:
A structure-only artifact that defines categories, questions, answer options, and related structure for future forms. A template does not contain any filled-in answers.
_Avoid_: Questionnaire, survey

**Form**:
An artifact created from a template that preserves the template's structure and records filled-in answers. A form's structure is fixed; only its answers are filled or changed while drafting.
_Avoid_: Response document, filled template

**Draft**:
An editable local artifact state before publishing. A template draft allows structure changes; a form draft allows answer changes.
_Avoid_: Work in progress, unsaved version

**Local Draft**:
A draft artifact stored in the user's browser-local state. Local draft access is an access condition, not a person role.
_Avoid_: Local user, draft owner

**Frozen**:
The read-only artifact condition after editing is complete. Frozen artifacts are not edited in place; changes happen by creating a new draft or copy.
_Avoid_: Locked, completed

**Published**:
The lifecycle state for a frozen artifact saved to a canonical URL. A published template has frozen structure for creating forms; a published form has frozen answers for reading, sharing, comparing, or copying. Current docs and code may still say "finalized" for templates; treat that as legacy language and a rename target, not a different domain concept.
_Avoid_: Finalized, completed

**Shared**:
An access condition where a share link exists for read access to a published artifact. Shared access does not provide deletion or management capability for the shared template or form.
_Avoid_: Public, published

**Owner Link**:
The non-shared access link for a published artifact. Possessing the owner link allows management actions such as deletion or share-link regeneration.
_Avoid_: Admin URL, admin link

**Share Link**:
A read-access link to a published artifact. Possessing the share link allows reading and permitted read-side actions, but not owner actions such as deletion or share-link regeneration.
_Avoid_: Public link, guest link

**Answer Option**:
One selectable response value available for a question, such as "must," "maybe," or "off limits."
_Avoid_: Answer value, enum value

**Answer Set**:
The collection of answer options defined by a template and carried into forms created from it.
_Avoid_: Answer schema, enumeration

**Question**:
A prompt inside a category that asks the user to reflect on one topic.
_Avoid_: Item, field

**Answer**:
The selected answer option for a question in a form.
_Avoid_: Selection, value

**Response**:
A question together with its selected answer in a form. Templates contain questions but not responses.
_Avoid_: Answered question, filled question

**Category**:
A named group of related questions within a template or form.
_Avoid_: Question set, question list, question collection, section, topic

**Readable Artifact**:
An artifact whose contents are currently visible to the visitor after satisfying any required link, password, or decryption requirements. Readability allows permitted read-side actions but does not imply owner capability.
_Avoid_: Accessible artifact, unlocked artifact

**Branch**:
To create a new local draft from a readable artifact without modifying the source artifact. Branching preserves the relevant structure; whether answers are preserved depends on the chosen branch action.
_Avoid_: Clone, restore, revert

**Fill Form**:
To create or use a draft form to provide answers for a template's structure. When the source is an already-filled form, this may be presented as refilling the form.
_Avoid_: Complete form, fill template

**Refill Form**:
To branch a readable form into a new draft form with the same structure and no filled answers.
_Avoid_: Reset form, clear form

**Revise Form**:
To branch a readable form into a new draft form while preserving its answers.
_Avoid_: Edit published form, unlock form

**Revise Template**:
To branch a readable artifact into a new draft template with the same structure and answer set, but no filled answers.
_Avoid_: Edit published template, unlock template

**Delete**:
To remove the underlying published artifact from both owner access and share access. Removing or regenerating a share link is not deletion; it only changes shared access.
_Avoid_: Delete share link, remove shared form

**Auto-Delete**:
Scheduled deletion of a published form after a chosen time. Auto-delete removes the underlying artifact, not just its share link.
_Avoid_: Share expiry, link expiry

**Compare**:
To read two or more published forms with matching structure side by side so people can interpret alignment themselves. Compare does not score, rank, or automatically judge agreement.
_Avoid_: Evaluate, score, match

**Source Template**:
The template whose structure and answer set were used to create a form. Forms created from the same source template are expected to be comparable, even if compatibility is ultimately determined by matching structure.
_Avoid_: Mother template, parent template

**Compatible Forms**:
Published forms that can be compared because they share the same source template or otherwise have matching structure.
_Avoid_: Matching forms, sibling forms

**User**:
A person using Garden Walk to create, fill, read, share, revise, or compare artifacts. Garden Walk models capabilities through access paths and local state, not through account-like person roles.
_Avoid_: Owner, sharee, account

**Password Protection**:
An optional access requirement that must be satisfied before a protected artifact becomes readable. Password protection is separate from link possession: a user may need both the correct link and the password.
_Avoid_: Form password, share password

**Encrypted Artifact**:
An artifact whose stored contents are not kept as plaintext by the server. Encryption does not necessarily mean password protection; an encrypted artifact can still be readable to anyone with the correct unprotected link.
_Avoid_: Password-protected artifact

**Recent Artifacts**:
Browser-local references to artifacts a user recently created or opened. Recent artifacts are not a server-side list and do not imply public discovery.
_Avoid_: Recent forms, recently published forms

**Workflow Step**:
One part of the user journey through Garden Walk: creating a template, filling a form, or reviewing results.
_Avoid_: Phase

## Example Dialogue

**Product expert**: A user starts by creating a template draft with categories, questions, and an answer set.

**Developer**: When they are done editing the structure, do they finalize it?

**Product expert**: Use "publish" as the domain word. Publishing the template freezes it and saves it to a canonical URL. The code may still say "finalized" for templates, but that is legacy language.

**Developer**: Once the template is published, the user can fill a form from it?

**Product expert**: Yes. Filling a form creates or uses a draft form with the template's structure. The form records answers as responses, while the source template remains unchanged.

**Developer**: What happens when the form is published?

**Product expert**: The form becomes frozen at its owner link. The owner link can manage the artifact, including deletion and share-link regeneration.

**Developer**: If someone opens the share link, are they looking at a separate shared form?

**Product expert**: No. Shared means a share link exists for read access to the published artifact. The share link does not grant deletion or other owner actions.

**Developer**: Can a user change a published form?

**Product expert**: Not in place. They can revise the form to branch a new draft that preserves answers, or refill the form to branch a new draft with the same structure and no filled answers.

**Developer**: Can they create a template from a form?

**Product expert**: Yes. Revising a template branches a readable artifact into a new template draft with the same structure and answer set, but no filled answers.

**Developer**: How do comparisons work?

**Product expert**: Users compare compatible published forms side by side. The app shows responses without scoring or judging agreement, so people can interpret alignment themselves.
