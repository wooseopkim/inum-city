create function search_animals(query text)
returns setof animals
language sql
as $$
  select * from animals
  where jsonb_path_exists(body, format('$.** ? (@.type() == "string" && @ like_regex "%s" flag "i")', query)::jsonpath);
$$;
