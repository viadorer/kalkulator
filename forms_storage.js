(function(){
  const SCHEMAS_KEY = 'forms_schemas_v1';
  const ENTRIES_KEY = 'forms_entries_v1';

  function readJSON(key, fallback){
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch(e){
      console.error('Storage parse error for', key, e);
      return fallback;
    }
  }

  function writeJSON(key, value){
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e){
      console.error('Storage write error for', key, e);
    }
  }

  function uid(){
    return 'f_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36);
  }

  function listSchemas(){
    const map = readJSON(SCHEMAS_KEY, {});
    return Object.values(map).sort((a,b)=> a.name.localeCompare(b.name));
  }

  function getSchema(id){
    const map = readJSON(SCHEMAS_KEY, {});
    return map[id] || null;
  }

  function saveSchema(schema){
    const map = readJSON(SCHEMAS_KEY, {});
    const now = new Date().toISOString();
    const id = schema.id || uid();
    const normalized = {
      id,
      name: schema.name || 'Nový formulář',
      description: schema.description || '',
      fields: Array.isArray(schema.fields) ? schema.fields : [],
      updatedAt: now,
      createdAt: schema.createdAt || now
    };
    map[id] = normalized;
    writeJSON(SCHEMAS_KEY, map);
    return id;
  }

  function deleteSchema(id){
    const map = readJSON(SCHEMAS_KEY, {});
    if (map[id]){
      delete map[id];
      writeJSON(SCHEMAS_KEY, map);
    }
    // Also delete entries for this schema
    const entries = readJSON(ENTRIES_KEY, {});
    if (entries[id]){
      delete entries[id];
      writeJSON(ENTRIES_KEY, entries);
    }
  }

  function listEntries(formId){
    const entries = readJSON(ENTRIES_KEY, {});
    return entries[formId] || [];
  }

  function saveEntry(formId, entry){
    const entries = readJSON(ENTRIES_KEY, {});
    const list = entries[formId] || [];
    list.push({ data: entry, savedAt: new Date().toISOString() });
    entries[formId] = list;
    writeJSON(ENTRIES_KEY, entries);
    return list.length - 1; // index
  }

  function deleteEntry(formId, index){
    const entries = readJSON(ENTRIES_KEY, {});
    const list = entries[formId] || [];
    if (index >=0 && index < list.length){
      list.splice(index,1);
      entries[formId] = list;
      writeJSON(ENTRIES_KEY, entries);
    }
  }

  function exportAll(){
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schemas: readJSON(SCHEMAS_KEY, {}),
      entries: readJSON(ENTRIES_KEY, {})
    };
    return JSON.stringify(payload, null, 2);
  }

  function importAll(jsonString, merge=true){
    const incoming = JSON.parse(jsonString);
    if (incoming == null) throw new Error('Neplatný JSON');

    // Case A: full export format { schemas: {id: schema}, entries: {...} }
    if (typeof incoming === 'object' && (incoming.schemas || incoming.entries)){
      const incSchemas = incoming.schemas || {};
      const incEntries = incoming.entries || {};

      if (!merge){
        writeJSON(SCHEMAS_KEY, incSchemas);
        writeJSON(ENTRIES_KEY, incEntries);
        return;
      }

      const curSchemas = readJSON(SCHEMAS_KEY, {});
      const curEntries = readJSON(ENTRIES_KEY, {});

      Object.keys(incSchemas).forEach(id=>{ curSchemas[id] = incSchemas[id]; });
      writeJSON(SCHEMAS_KEY, curSchemas);

      Object.keys(incEntries).forEach(id=>{
        const a = curEntries[id] || [];
        const b = Array.isArray(incEntries[id]) ? incEntries[id] : [];
        curEntries[id] = a.concat(b);
      });
      writeJSON(ENTRIES_KEY, curEntries);
      return;
    }

    // Case B: single schema object or array of schema objects
    const curSchemas = readJSON(SCHEMAS_KEY, {});
    const curEntries = readJSON(ENTRIES_KEY, {});

    const addSchema = (sch)=>{
      if (!sch || typeof sch !== 'object' || !Array.isArray(sch.fields)) return;
      const now = new Date().toISOString();
      const id = sch.id || uid();
      curSchemas[id] = {
        id,
        name: sch.name || 'Nový formulář',
        description: sch.description || '',
        fields: sch.fields,
        updatedAt: now,
        createdAt: sch.createdAt || now
      };
    };

    if (Array.isArray(incoming)) incoming.forEach(addSchema);
    else if (typeof incoming === 'object') addSchema(incoming);
    else throw new Error('Neplatný formát souboru');

    writeJSON(SCHEMAS_KEY, curSchemas);
    writeJSON(ENTRIES_KEY, curEntries);
  }

  function download(filename, text){
    const blob = new Blob([text], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  window.FormsStore = {
    listSchemas, getSchema, saveSchema, deleteSchema,
    listEntries, saveEntry, deleteEntry,
    exportAll, importAll, download
  };
})();
