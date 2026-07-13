#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('src/App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

old = '''            <p class="mt-3 text-slate-400">Ton CV sentimental affiché comme une page de profil premium.</p>
            <div id="pdf-preview" class="mt-6 space-y-5 rounded-3xl bg-slate-950/90 p-5">
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-brand-300">{{ privacyLabel }}</p>
                <h3 class="mt-3 text-2xl font-semibold text-white">{{ form.fullName || 'Ton Nom' }}</h3>
                <p class="mt-2 text-slate-400">{{ form.role || 'Partenaire recherché' }}</p>
              </div>
              <p class="text-slate-300">{{ form.bio || 'Raconte-toi ici pour donner envie de te connaître.' }}</p>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-3xl bg-slate-900 p-4">
                  <p class="text-sm uppercase tracking-[0.18em] text-slate-400">À propos</p>
                  <p class="mt-3 text-sm text-slate-200">{{ form.lookingFor || 'À la recherche d'une relation authentique.' }}</p>
                </div>
                <div class="rounded-3xl bg-slate-900 p-4">
                  <p class="text-sm uppercase tracking-[0.18em] text-slate-400">Skills de couple</p>
                  <div class="mt-3 space-y-3">
                    <template v-for="skill in form.coupleSkills" :key="skill.id">
                      <div>
                        <div class="flex items-center justify-between text-sm text-slate-300">
                          <span>{{ skill.name }}</span>
                          <span>{{ skill.level }}/10</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-white/10">
                          <div :style="{ width: `${skill.level * 10}%` }" class="h-full rounded-full bg-brand-500"></div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>'''

new = '''            <p class="mt-3 text-slate-400">Ton CV sentimental complet et formaté.</p>
            <div id="pdf-preview" class="mt-6 space-y-4 rounded-3xl bg-slate-950/90 p-5 overflow-y-auto max-h-[600px]">
              <!-- Header -->
              <div class="border-b border-slate-700 pb-3">
                <p class="text-xs uppercase tracking-[0.3em] text-brand-300">{{ privacyLabel }}</p>
                <h3 class="mt-2 text-2xl font-bold text-white">{{ form.fullName || 'Ton Nom' }}</h3>
                <p class="mt-1 text-sm text-brand-300">{{ form.role || 'Partenaire recherché' }}</p>
              </div>

              <!-- Bio -->
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Qui je suis</p>
                <p class="mt-2 text-xs text-slate-200 leading-tight">{{ form.bio || 'Raconte-toi ici...' }}</p>
              </div>

              <!-- Personnalité & Valeurs -->
              <div class="grid gap-2 grid-cols-2">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Perso</p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <template v-for="trait in form.personalityTraits" :key="trait">
                      <span class="rounded-full bg-brand-500/20 px-1.5 py-0.5 text-xs text-brand-100">{{ trait }}</span>
                    </template>
                  </div>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Valeurs</p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <template v-for="value in form.values" :key="value">
                      <span class="rounded-full bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-100">{{ value }}</span>
                    </template>
                  </div>
                </div>
              </div>

              <!-- À la recherche de -->
              <div class="rounded-lg bg-slate-900/80 p-2 border border-brand-500/20">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Cherche</p>
                <p class="mt-1 text-xs text-slate-100">{{ form.lookingFor || 'Relation authentique.' }}</p>
              </div>

              <!-- Skills -->
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Skills en couple</p>
                <div class="mt-2 space-y-1.5">
                  <template v-for="skill in form.coupleSkills" :key="skill.id">
                    <div>
                      <div class="flex justify-between text-xs">
                        <span class="font-medium text-slate-100">{{ skill.name }}</span>
                        <span class="text-brand-300">{{ skill.level }}/10</span>
                      </div>
                      <div class="mt-0.5 h-1 rounded-full bg-slate-700">
                        <div :style="{ width: `${skill.level * 10}%` }" class="h-full rounded-full bg-brand-500"></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Relations -->
              <div v-if="form.relationships.length > 0">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Parcours</p>
                <div class="mt-1 space-y-1">
                  <template v-for="rel in form.relationships" :key="rel.id">
                    <div class="rounded-lg bg-slate-900/60 p-2 border border-slate-700 text-xs">
                      <p class="font-medium text-white">{{ rel.partnerName }}</p>
                      <p class="text-slate-400">{{ rel.startDate }} → {{ rel.endDate }}</p>
                      <p class="text-slate-500">{{ rel.reason }}</p>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Avis -->
              <div v-if="form.references.length > 0">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Avis</p>
                <div class="mt-1 space-y-1">
                  <template v-for="ref in form.references" :key="ref.id">
                    <div class="rounded-lg bg-slate-900/60 p-2 border border-slate-700 text-xs">
                      <p class="italic text-slate-100">"{{ ref.quote }}"</p>
                      <p class="text-slate-400 mt-0.5">— {{ ref.name }}</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>'''

if old in content:
    content = content.replace(old, new)
    with open('src/App.vue', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Preview enriched with all data fields')
else:
    print('✗ Could not find matching text to replace')
