export const prerender = false;
export const ssr = false;

import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server"
import { zod } from "sveltekit-superforms/adapters";
import { emailSchema } from "../../lib/utils/schema";
import { fail } from "@sveltejs/kit";
import emailHelper from "$lib/utils/emailHelper";

export const load: PageServerLoad = (async () => {
  // Server API:
  const form = await superValidate(zod(emailSchema));
  // Always return { form } in load and form actions.
  return { form };
});

export const actions: Actions = {
  sendEmail: async (event) => {
    const form = await superValidate(event, zod(emailSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    console.log('**this is +page.server.ts**');
    const { from, subject, message } = form.data;
    try {
      const emailResponse = await emailHelper(from, subject, message);
      console.log('message sent from ', emailResponse.envelope.from);
    } catch (error) {
      console.log(error);
    }

    return {
      form,
    };
  },
};