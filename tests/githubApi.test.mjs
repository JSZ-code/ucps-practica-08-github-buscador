import test from 'node:test';
import assert from 'node:assert/strict';
import { obtenerUsuario } from '../src/services/githubApi.mjs';

const respuesta = (status, datos) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => datos,
});
const perfil = {
  name: 'The Octocat', login: 'octocat', bio: 'Mascota de GitHub',
  avatar_url: 'https://avatars.githubusercontent.com/u/583231',
  html_url: 'https://github.com/octocat',
};

test('P8-01: éxito: mapea datos del perfil', async () => {
  let urlConsultada;
  const res = await obtenerUsuario('octocat', {
    fetchImpl: async (url) => { urlConsultada = url; return respuesta(200, perfil); },
  });
  assert.equal(urlConsultada, 'https://api.github.com/users/octocat');
  assert.deepEqual(res, {
    nombre: 'The Octocat', login: 'octocat', biografia: 'Mascota de GitHub',
    avatarUrl: perfil.avatar_url, perfilUrl: perfil.html_url,
  });
});

test('P8-02: input vacío: nunca llama a fetch', async () => {
  let llamadas = 0;
  await assert.rejects(obtenerUsuario('', { fetchImpl: async () => { llamadas++; } }), /Ingresa/);
  assert.equal(llamadas, 0);
});

test('P8-03: espacios: nunca llama a fetch', async () => {
  let llamadas = 0;
  await assert.rejects(obtenerUsuario('   ', { fetchImpl: async () => { llamadas++; } }), /Ingresa/);
  assert.equal(llamadas, 0);
});

test('P8-04: 404 reporta error para catch', async () => {
  await assert.rejects(obtenerUsuario('usuario-inexistente', {
    fetchImpl: async () => respuesta(404, { message: 'Not Found' }),
  }), /404/);
});

test('P8-05: 403 maneja límite de API', async () => {
  await assert.rejects(obtenerUsuario('octocat', {
    fetchImpl: async () => respuesta(403, {}),
  }), /limitado/);
});

test('P8-06: 429 maneja exceso de peticiones', async () => {
  await assert.rejects(obtenerUsuario('octocat', {
    fetchImpl: async () => respuesta(429, {}),
  }), /limitado/);
});

test('P8-07: sin bio ni nombre usa textos alternativos', async () => {
  const datos = { ...perfil, name: null, bio: null };
  const res = await obtenerUsuario('octocat', { fetchImpl: async () => respuesta(200, datos) });
  assert.equal(res.nombre, 'octocat');
  assert.equal(res.biografia, 'Sin biografía');
});

test('P8-08: se recortan espacios en username', async () => {
  let url;
  await obtenerUsuario('  octocat  ', {
    fetchImpl: async (u) => { url = u; return respuesta(200, perfil); },
  });
  assert.equal(url, 'https://api.github.com/users/octocat');
});

test('P8-09: respuesta incompleta se rechaza', async () => {
  await assert.rejects(obtenerUsuario('octocat', {
    fetchImpl: async () => respuesta(200, { login: 'octocat' }),
  }), /incompletos/);
});

test('P8-10: errores HTTP 500 producen error informativo', async () => {
  await assert.rejects(obtenerUsuario('octocat', {
    fetchImpl: async () => respuesta(500, {}),
  }), /500/);
});
